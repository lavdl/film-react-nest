import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { APP_LOGGER } from './logger/logger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useLogger(app.get(APP_LOGGER));
  await app.listen(3000);
}
bootstrap();
