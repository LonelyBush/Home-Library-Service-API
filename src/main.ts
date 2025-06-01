import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseModule } from './database/database.module';
import { InMemoryMapDB } from './innerDb/innerDb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dbModule = app.select(DatabaseModule);
  const db = dbModule.get<InMemoryMapDB>('DATABASE');
  db.createCollection('Users');
  db.createCollection('Tracks');
  await app.listen(4000);
}
bootstrap();
