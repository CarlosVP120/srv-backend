import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../config';

export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.tokenExtractor(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { user, token: newToken } = await firstValueFrom(
        this.client.send('security.refresh', token),
      );
      request.user = user;
      request.token = newToken;

      request.user = { token };

      return true;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException();
    }
  }

  tokenExtractor(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
