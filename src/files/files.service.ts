import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }
}
