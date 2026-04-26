import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url, ip } = req;
    // Skip User-Agent in production — reduces log file size on VPS
    const userAgent = isProd ? '' : ` ua:${(req.get('user-agent') || '').slice(0, 50)}`;
    const userId = (req as any).user?.id || 'anon';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse<Response>();
          const duration = Date.now() - now;
          this.logger.log(
            `${method} ${url} ${res.statusCode} ${duration}ms — user:${userId} ip:${ip}${userAgent}`,
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
