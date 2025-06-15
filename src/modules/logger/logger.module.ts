import { Module } from '@nestjs/common';
import { CustomLogger } from './logger.service';
import { FileModule } from '../file/file.module';

const { LOG_LEVEL } = process.env;

@Module({
  imports: [FileModule],
  providers: [
    CustomLogger,
    {
      provide: 'LOG_LEVELS',
      useValue: ['log', 'error', 'warn'].slice(0, !LOG_LEVEL ? 0 : +LOG_LEVEL),
    },
  ],
  exports: [CustomLogger],
})
export class LoggerModule {}
