import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const userId = (req as any).user?.id || 'anonymous';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse<Response>();
          const duration = Date.now() - now;
          this.logger.log(
            `${method} ${url} ${res.statusCode} ${duration}ms — user:${userId} ip:${ip} ua:${userAgent.slice(0, 50)}`,
          );
        },
        error: (err) => {
          const duration = Date.now() - now;
          const status = err?.status || 500;
          this.logger.warn(
            `${method} ${url} ${status} ${duration}ms — user:${userId} ip:${ip} err:${err?.message}`,
          );
        },
      }),
    );
  }
}
