import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('files')
export class FilesController {
  constructor() {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      Number(process.env.MAXIMUM_NUMBER_OF_FILES) || 10,
      {
        // Stored in memory
        storage: memoryStorage(),
        // 10MB size limit for each file
        limits: {
          fileSize: parseInt(process.env.FILE_SIZE_LIMIT) || 10 * 1024 * 1024,
        },
        // Allowed files type
        fileFilter: (req, file, callback) => {
          const allowedTypes = (
            process.env.ALLOWED_FILE_TYPES ||
            'application/pdf,text/csv,application/vnd.ms-excel'
          ).split(',');
          if (!allowedTypes.includes(file.mimetype)) {
            return callback(
              new BadRequestException('Invalid file type'),
              false,
            );
          }
          callback(null, true);
        },
      },
    ),
  )
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    // Check files are attached
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }
      // Got files
      // TODO: Check base64 files type validation

      // TODO2: Parse the documents and start filling the matrix with the customers names and statuses

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
