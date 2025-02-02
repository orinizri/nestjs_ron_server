import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  compareNames,
  parseDocxBuffer,
  validateFile,
  validateTimestampAndConvertToDate,
} from './files.helpers';
import { Customer } from 'src/customers/customers.entity';
import { CreateCustomerDto } from 'src/customers/dto/customer.dto';
import { FILE_CONTENT } from 'src/utils/translations';

@Injectable()
export class FilesService {
  constructor(private dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async receiveFolders(
    files: Array<Express.Multer.File>,
    lastModified: number[],
  ) {
    try {
      const errors = [];
      const filesSummary = [];
      // Check files are attached
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }
      // Loop across files
      const customersToUpdate: Partial<CreateCustomerDto>[] = [
        // {
        //   firstName: 'אבי',
        //   middleName: null,
        //   lastName: 'פן',
        // },
      ];
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        // Validate file's last modified timestamp
        const lastModifiedDate = validateTimestampAndConvertToDate(
          lastModified[fileIndex],
        );
        if (!lastModifiedDate.valid) {
          errors.push(lastModifiedDate.error);
          continue;
        }
        const isFileValid = validateFile(files[fileIndex]);
        if (!isFileValid.valid) {
          errors.push(isFileValid);
          continue;
        }
        // Check there is a folder's path with file
        const fullPath = Buffer.from(
          files[fileIndex].originalname,
          'latin1',
        ).toString('utf-8');
        if (!fullPath) {
          errors.push({
            valid: false,
            origin: files[fileIndex].originalname,
            error: 'Missing path',
          });
          continue;
        }
        console.log('fullPath', fullPath);
        // Extract from path customer name
        const [customerName, customerMiddleName, customerLastName] = fullPath
          .split('/')[0]
          .split(' ');
        const customerFullName = {
          firstName: customerName,
          middleName: customerLastName ? customerMiddleName : null,
          lastName: customerLastName || customerMiddleName,
        };
        const isCustomerBeingUpdated = customersToUpdate.findIndex(
          (customerToUpdate) =>
            compareNames(
              customerFullName,
              customerToUpdate.firstName,
              customerToUpdate.middleName,
              customerToUpdate.lastName,
            ),
        );
        // console.log('!@#', isCustomerBeingUpdated);
        if (isCustomerBeingUpdated === -1) {
          customersToUpdate.push(customerFullName);
        }
        // Extract from path file name and type
        const [fileName, fileType] = fullPath.split('/')[1].split('.');
        // console.log('fileName', fileName);
        // console.log('fileType', fileType);
        // Investigate file content with using FILE_CONTENT dictionary
        let contentType: string = '';
        for (let [key, values] of Object.entries(FILE_CONTENT)) {
          for (let value of values) {
            if (fileName.includes(value)) {
              contentType = key;
              break;
            }
          }
        }
        // console.log('contentType', contentType);
        if (!contentType) {
          errors.push({
            valid: false,
            origin: fileName,
            error: 'Wrong content type',
          });
          continue;
        }
        // Read file content based on the type
        // Parse and validate file content - required columns for xls or proper document structure
        if (contentType === 'registrationDocument') {
          // Parse and validate file content - required columns for docx or proper document structure
          const docxContent = await parseDocxBuffer(files[fileIndex].buffer);
          console.log('docxContent', docxContent);
        }

        // Connect to my local db (SQL) for update/create operations

        // If the file's last modified date is older than the last update time in the database, skip processing.

        // Else start a transaction.

        // Update the necessary rows based on the file data.

        // Commit the transaction only if all rows are successfully updated.
      }
      // console.log('errors@:', errors);
      return {
        message: 'Files received successfully',
        files: files.map((file) => ({
          originalName: file.originalname,
          fileName: file.filename,
          path: file.path,
          size: file.size,
        })),
      };
    } catch (error) {
      console.error('caught error:', error);
      return {
        message: error.message,
      };
    }
  }
}
