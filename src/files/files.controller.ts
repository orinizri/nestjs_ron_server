import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { datesModifiedInterface } from './files.interfaces.js';
import { FilesService } from './files.service.js';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // files/upload route
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', null, {
      // Stored in memory
      storage: memoryStorage(),
      // 10MB size limit for each file
      // limits: {
      //   fileSize: parseInt(process.env.FILE_SIZE_LIMIT) || 10 * 1024 * 1024,
      // },
      // Get the full path (in originalname of the file's object)
      preservePath: true,
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() { lastModified }: datesModifiedInterface,
  ) {
    return this.filesService.receiveFolders(files, lastModified)
  }
}
