import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../config';

export class SecurityGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.tokenExtractor(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Check if token is valid
      const { user, token: validatedToken } = await firstValueFrom(
        this.client.send('security.verify', token),
      );

      request.user = user;
      request.token = validatedToken;

      return true;
    } catch (err) {
      console.error(err);
      throw new RpcException(err); // Or return a "new UnauthorizedException()"
    }
  }

  tokenExtractor(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
