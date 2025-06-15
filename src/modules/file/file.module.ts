import { Module } from '@nestjs/common';
import { RotatingFileService } from './file.service';

const { MAX_LOG_FILE_SIZE } = process.env;

@Module({
  providers: [
    RotatingFileService,
    {
      provide: 'FILE_NAME',
      useValue: 'home-lib',
    },
    {
      provide: 'MAX_SIZE_KB',
      useValue: MAX_LOG_FILE_SIZE,
    },
    {
      provide: 'MAX_FILES_IN_ROW',
      useValue: 2,
    },
  ],
  exports: [RotatingFileService],
})
export class FileModule {}
