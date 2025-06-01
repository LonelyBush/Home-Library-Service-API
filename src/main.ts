import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseModule } from './database/database.module';
import { InMemoryMapDB } from './innerDb/innerDb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dbModule = app.select(DatabaseModule);
  dbModule.get<InMemoryMapDB>('DATABASE');
  await app.listen(4000);
}
bootstrap();
