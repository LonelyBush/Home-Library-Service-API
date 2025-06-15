import { Module } from '@nestjs/common';
import { CustomLogger } from './logger.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  providers: [
    CustomLogger,
    {
      provide: 'LOG_LEVELS',
      useValue: ['log', 'error'],
    },
  ],
  exports: [CustomLogger],
})
export class LoggerModule {}
