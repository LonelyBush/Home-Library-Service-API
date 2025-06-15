import {
  ConsoleLogger,
  Inject,
  Injectable,
  LoggerService,
  LogLevel,
  Scope,
} from '@nestjs/common';
import { RotatingFileService } from '../file/file.service';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger implements LoggerService {
  constructor(
    @Inject(RotatingFileService)
    private readonly fileService: RotatingFileService,
    @Inject('LOG_LEVELS')
    private readonly logLevels: LogLevel[],
  ) {
    super();
    this.setContext('Custom Logger');
  }

  log(message: string) {
    if (this.logLevels.includes('log')) {
      const getDate = new Date().toUTCString();
      this.writeToFile(
        `📢 \x1b[32m [LOG] \x1b[0m-\x1b[33m ${getDate} \x1b[0m: ` +
          `\x1b[32m ${message} \x1b[0m`,
      );
      super.log(message);
    }
  }
  error(message: string) {
    if (this.logLevels.includes('error')) {
      const getDate = new Date().toUTCString();
      this.writeToFile(
        `❌ \x1b[31m [ERROR] \x1b[0m-\x1b[33m ${getDate} \x1b[0m: ` +
          `\x1b[31m ${message} \x1b[0m`,
      );
      super.error(message);
    }
  }
  warn(message: string) {
    if (this.logLevels.includes('warn')) {
      const getDate = new Date().toUTCString();
      this.writeToFile(
        `⚠️ \x1b[33m [WARN] \x1b[0m-\x1b[33m ${getDate} \x1b[0m: ` +
          `\x1b[33m ${message} \x1b[0m`,
      );
      super.warn(message);
    }
  }
  writeToFile(message: string) {
    this.fileService.write(message);
  }
}

/*
Colors numbers
Text colors:

Black: 30
Red: 31
Green: 32
Yellow: 33
Blue: 34
Magenta: 35
Cyan: 36
White: 37
Background colors:

Black: 40
Red: 41
Green: 42
Yellow: 43
Blue: 44
Magenta: 45
Cyan: 46
White: 47
*/
