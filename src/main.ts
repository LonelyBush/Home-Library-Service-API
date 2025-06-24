import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { readFile } from 'fs/promises';
import { load as loadYaml } from 'js-yaml';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/exceptionFilter';
import { resolve } from 'path';

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const raw = await readFile('doc/api.yaml', 'utf8');
  const doc = loadYaml(raw) as OpenAPIObject;
  SwaggerModule.setup('doc', app, doc);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(PORT);
}

bootstrap();
export const __basedir = resolve('./');

process.on('uncaughtException', async (err, origin) => {
  console.log(
    `Uncaught Exception is occured! Caught exception: ${err}, Exception origin: ${origin}`,
  );
  console.log(`Shutting down app...`);
  process.exit(1);
});
process.on('unhandledRejection', async (reason, promise) => {
  console.log(
    `Unhandled Rejection is occured! Reason: ${reason} Promise: ${promise.toString()}`,
  );
  console.log(`Shutting down app...`);
  process.exit(1);
});
