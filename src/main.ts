import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get port from env
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  await app.listen(port || 8000);
  console.log(`Server is running at port ${port || 8000}`)
}

bootstrap();
