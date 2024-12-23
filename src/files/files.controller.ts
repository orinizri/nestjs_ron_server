import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  FILES_ALLOWED_EXTENSIONS,
  FILE_SIZE_LIMIT,
} from '../utils/constants.js';

interface datesModifiedInterface {
  lastModified: number[];
}

@Controller('files')
export class FilesController {
  constructor() {}

  validateFile(file: Express.Multer.File) {
    // File exists check
    if (!file?.buffer) {
      return {
        valid: false,
        name: file.filename,
        origin: file.originalname,
        error: 'File not found',
      };
    }
    // Size check
    if (file.size > FILE_SIZE_LIMIT) {
      return {
        valid: false,
        name: file.filename,
        origin: file.originalname,
        error: 'File too big',
      };
    }
    const [folderName, fileName] = Buffer.from(file.originalname, 'binary')
      .toString('utf-8')
      .split('/');
    const extension = fileName.split('.').pop()?.toLowerCase();
    // Extension type check
    if (
      !extension ||
      !Object.keys(FILES_ALLOWED_EXTENSIONS).includes(extension)
    ) {
      return {
        valid: false,
        name: file.filename,
        origin: file.originalname,
        error: 'Extension is not allowed',
      };
    }
    // File signature congruency check
    if (
      !file.buffer
        .toString('hex')
        .startsWith(FILES_ALLOWED_EXTENSIONS[extension].hex_prefix)
    ) {
      return {
        valid: false,
        name: file.filename,
        origin: file.originalname,
        error: `Invalid signature (${file.mimetype}, ${file.buffer.toString('hex').slice(0, 10)})`,
      };
    }
    return {
      valid: true,
      name: file.filename,
      origin: file.originalname,
      error: null,
    };
  }

  validateTimestampAndConvertToDate(timestamp: string | number): {
    valid: boolean;
    error?: string;
    data?: Date;
  } {
    // Validate TimeStamp
    if (isNaN(Number(timestamp))) {
      return { valid: false, error: 'Invalid lastModified timestamp' };
    }
    const lastModifiedDate = new Date(Number(timestamp));
    // Validate date
    if (isNaN(lastModifiedDate.getTime())) {
      return { valid: false, error: 'Invalid date derived from timestamp' };
    }
    // Validate date is in the past
    if (lastModifiedDate > new Date()) {
      return { valid: false, error: 'Timestamp cannot be in the future' };
    }
    return { valid: true, data: lastModifiedDate };
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', null, {
      // Stored in memory
      storage: memoryStorage(),
      // 10MB size limit for each file
      limits: {
        fileSize: parseInt(process.env.FILE_SIZE_LIMIT) || 10 * 1024 * 1024,
      },
      // Get the full path (in originalname of the file's object)
      preservePath: true,
    }),
  )
  uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() { lastModified }: datesModifiedInterface,
  ) {
    console.log('dates', lastModified);
    try {
      const errors = [];
      const filesSummary = [];
      // Check files are attached
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }
      // Got files
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        console.log(
          files[fileIndex],
          '-',
          new Date(Number(lastModified[fileIndex])),
        );
        // Validate file's last modified timestamp
        const lastModifiedDate = this.validateTimestampAndConvertToDate(lastModified[fileIndex]);
        if (!lastModifiedDate.valid) {
          errors.push(lastModifiedDate.error)
          continue;
        }
        const isFileValid = this.validateFile(files[fileIndex]);
        if (!isFileValid.valid) {
          errors.push(isFileValid);
          continue;
        }
        // TODO: Check if the customer is already in the file, add it or update it with the relevant information from the file
        
        // Parse and validate file content - required columns for xls or proper document structure

        // Connect to my local db (SQL)

        // If the file's last modified date is older than the last update time in the database, skip processing.        

        // Else start a transaction.
        
        // Update the necessary rows based on the file data.
        
        // Commit the transaction only if all rows are successfully updated.        
      }

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
