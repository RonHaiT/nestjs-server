import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  LoggerService,
} from '@nestjs/common';
import * as requestIp from 'request-ip';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const message = exception.message;
    const timestamp = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    response.status(status).json({
      code: status,
      timestamp,
      path: request.url,
      message,
      ip: requestIp.getClientIp(request),
    });
  }
}
