import { NestFactory } from '@nestjs/core';
import { initTestData } from 'test/test-data';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
initTestData();
