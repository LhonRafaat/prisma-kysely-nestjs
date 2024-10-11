import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const args = process.argv.slice(2);
  const numberOfUsers = parseInt(args[0], 10) || 10; // Default to 10 users if not specified

  await app.close();
}

bootstrap();
