import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private myLogger: CustomLogger) {
    this.myLogger.setContext('Logger Middleware');
  }
  use(req: Request, res: Response, next: NextFunction) {
    const { baseUrl, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const createLog = {
        response: {
          status_code: statusCode,
        },
        request: {
          url: baseUrl,
          query,
          body,
        },
      };
      this.myLogger.log(JSON.stringify(createLog));
    });
    next();
  }
}
