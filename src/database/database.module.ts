import { Inject, Module } from '@nestjs/common';
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
export class DatabaseModule {
  constructor(@Inject('DATABASE') private readonly db: InMemoryMapDB) {}

  onModuleInit() {
    this.db.createCollection('Users');
    this.db.createCollection('Tracks');
  }
}
