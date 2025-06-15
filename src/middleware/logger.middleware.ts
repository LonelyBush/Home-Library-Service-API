import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private myLogger: CustomLogger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { baseUrl, query, body } = req;
    res.on('finish', () => {
      const { statusCode } = res;
      if (![404, 400, 422, 500, 403].includes(statusCode)) {
        this.myLogger.log(
          `Response code: ${statusCode} Url: ${baseUrl} Query: ${JSON.stringify(query)} Body: ${JSON.stringify(body)}`,
        );
      } else {
        this.myLogger.error(
          `Response code: ${statusCode} Url: ${baseUrl} Query: ${JSON.stringify(query)} Body: ${JSON.stringify(body)}`,
        );
      }
    });
    /*
    process.on('unhandledRejection', async (err) => {
      this.myLogger.setContext('Unhandled Rejection');
      this.myLogger.error(
        `Unhandled Rejection is occured! Message: ${err.toString()}`,
      );
      this.myLogger.warn(`Shutting down app...`);
      process.exit(1);
    });
    process.on('uncaughtException', async (err) => {
      this.myLogger.setContext('Uncaught Exception');
      this.myLogger.error(
        `Uncaught Exception is occured! Message: ${err.toString()}`,
      );
      this.myLogger.warn(`Shutting down app...`);
      process.exit(1);
    });
    */
    next();
  }
}
