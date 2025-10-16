import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  LoggerService,
  BadRequestException,
} from '@nestjs/common';
import * as requestIp from 'request-ip';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const timestamp = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // 处理验证错误
    let message = exception.message;
    let errors: any = null;

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();

      // 检查是否是验证错误
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;

        if (responseObj.message && Array.isArray(responseObj.message)) {
          // 方案1：直接返回原始错误消息数组（最简单）
          errors = responseObj.message;
          message = '请求参数验证失败';

          // 方案2：如果需要按字段分组，使用更通用的方法
          // errors = this.groupErrorsByField(responseObj.message);
          // message = '请求参数验证失败';
        }
      }
    }

    const errorResponse: any = {
      code: status,
      timestamp,
      path: request.url,
      message,
      ip: requestIp.getClientIp(request),
    };

    // 如果有详细的验证错误，添加到响应中
    if (errors) {
      errorResponse.errors = errors;
    }

    response.status(status).json(errorResponse);
  }

  // 通用的错误分组方法（可选）
  private groupErrorsByField(
    errorMessages: string[],
  ): Array<{ field: string; messages: string[] }> {
    const fieldErrors: { [key: string]: string[] } = {};

    errorMessages.forEach((errorMsg: string) => {
      // 尝试从错误消息中提取字段名
      // 这适用于 class-validator 的标准错误格式
      const fieldMatch = errorMsg.match(/^(\w+)\s/);
      const fieldName = fieldMatch ? fieldMatch[1] : 'unknown';

      if (!fieldErrors[fieldName]) {
        fieldErrors[fieldName] = [];
      }
      fieldErrors[fieldName].push(errorMsg);
    });

    return Object.keys(fieldErrors).map((field) => ({
      field,
      messages: fieldErrors[field],
    }));
  }
}
