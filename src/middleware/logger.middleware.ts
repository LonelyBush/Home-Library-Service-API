import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private myLogger: CustomLogger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { baseUrl, query, body, method } = req;

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;

      if (![404, 400, 422, 500, 403].includes(statusCode)) {
        this.myLogger.log(
          `Request: Method: ${method} Url: ${baseUrl} Query: ${JSON.stringify(query)} Body: ${JSON.stringify(body)} Response: Code: ${statusCode} Message: ${statusMessage}`,
        );
      } else {
        this.myLogger.error(
          `Request: Method: ${method} Url: ${baseUrl} Query: ${JSON.stringify(query)} Body: ${JSON.stringify(body)} Response: Code: ${statusCode} Message: ${statusMessage}`,
        );
      }
    });
    next();
  }
}
