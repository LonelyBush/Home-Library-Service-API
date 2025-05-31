import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InMemoryMapDB } from './innerDb/innerDb';

export const initDb = new InMemoryMapDB();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();
