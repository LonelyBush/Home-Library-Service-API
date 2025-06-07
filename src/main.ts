import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { readFile } from 'fs/promises';
import { load as loadYaml } from 'js-yaml';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const raw = await readFile('doc/api.yaml', 'utf8');
  const doc = loadYaml(raw) as OpenAPIObject;
  SwaggerModule.setup('doc', app, doc);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
}
bootstrap();
