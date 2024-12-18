import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class GlobalRpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // If error.status is not a valid HTTP status code or its a string, set it to 500
    if (
      (error.status && error.status < 100) ||
      error.status > 599 ||
      typeof error.status === 'string'
    ) {
      error.status = 500;
    }

    response.status(error.status).json(error);
  }
}
