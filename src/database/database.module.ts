import { Module } from '@nestjs/common';
import { InMemoryMapDB } from 'src/innerDb/innerDb';

@Module({
  providers: [
    {
      provide: 'DATABASE',
      useValue: new InMemoryMapDB(),
    },
  ],
  exports: ['DATABASE'],
})
export class DatabaseModule {}
