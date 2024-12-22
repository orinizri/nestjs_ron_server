import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  FILES_ALLOWED_EXTENSIONS,
  FILE_SIZE_LIMIT,
} from '../utils/constants.js';
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
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      const errors = [];
      const filesSummary = [];
      // Check files are attached
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }
      // Got files
      for (let file of files) {
        const isFileValid = this.validateFile(file);
        if (!isFileValid.valid) {
          errors.push(isFileValid);
          continue;
        }

        // TODO: Check if the customer is already in the file, add or update it with the relevant information from the file
        // TODO2: Parse the documents and start filling the matrix with the customers names and statuses
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
