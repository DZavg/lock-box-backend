import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '@/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', async () => {
      const { statusCode } = response;

      await this.loggerService.create({
        method,
        url: request.url,
        status_code: statusCode,
        user_agent: userAgent,
        ip,
      });
    });

    next();
  }
}
