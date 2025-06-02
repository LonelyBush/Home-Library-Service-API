import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseModule } from './database/database.module';
import { InMemoryMapDB } from './innerDb/innerDb';
import { readFile } from 'fs/promises';
import { load as loadYaml } from 'js-yaml';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const raw = await readFile('doc/api.yaml', 'utf8');
  const doc = loadYaml(raw) as OpenAPIObject;
  SwaggerModule.setup('doc', app, doc);
  const dbModule = app.select(DatabaseModule);
  dbModule.get<InMemoryMapDB>('DATABASE');
  await app.listen(4000);
}
bootstrap();
