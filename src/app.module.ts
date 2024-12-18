import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    FilesModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally (.env)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
