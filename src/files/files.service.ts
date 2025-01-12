import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  compareNames,
  validateFile,
  validateTimestampAndConvertToDate,
} from './files.helpers';
import { Customer } from 'src/customers/customers.entity';
import { CreateCustomerDto } from 'src/customers/dto/customer.dto';

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
      const customersToUpdate : Partial<CreateCustomerDto>[] = [{
        firstName: 'אבי',
        middleName: null,
        lastName: 'פן'
      }];
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        console.log(
          files[fileIndex],
          '-',
          new Date(Number(lastModified[fileIndex])),
        );
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
        console.log("fullPath", fullPath)
        // Extract from path customer name
        const [customerName, customerMiddleName, customerLastName] = fullPath
          .split('/')[0]
          .split(' ');
          const customerFullName = {
            firstName: customerName,
            middleName: customerLastName ? customerMiddleName : null,
            lastName: customerLastName || customerMiddleName,
          }
        const customerExists = customersToUpdate.findIndex(customerToUpdate => compareNames(customerFullName, customerToUpdate.firstName, customerToUpdate.middleName, customerToUpdate.lastName))
        console.log("!@#", customerExists);
        
          // Extract from path file name and type
        const [fileName, fileType] = fullPath.split('/')[1].split('.');
        console.log("fileName", fileName);
        console.log("fileType", fileType);
        // Investigate file content with FILE_CONTENT
        // Update most up to date last modified file date 

        // Create/Update customer
        let customer = await this.dataSource.getRepository(Customer).findOne({
          where: customerFullName,
        });
        console.log('customer', customer);
        // Add it or update it with the relevant information from the file
        if (customer === null) {
           const newCustomer = this.dataSource.getRepository(Customer).create({
            ...customerFullName,
            
           })
        } else {
          
        }
        // Parse and validate file content - required columns for xls or proper document structure

        // Connect to my local db (SQL)

        // If the file's last modified date is older than the last update time in the database, skip processing.

        // Else start a transaction.

        // Update the necessary rows based on the file data.

        // Commit the transaction only if all rows are successfully updated.
      }
      console.log('errors@:', errors);
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
