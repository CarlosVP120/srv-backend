import { Controller, Post, Body, Inject, UseGuards } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { NATS_SERVICE } from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { SecurityGuard } from './security.guard';
import { Token } from '../common/decorators/token.decorator';

@Controller('security')
export class SecurityController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('security.login', loginUserDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(SecurityGuard)
  @Post('refresh')
  refresh(@Token() token: string) {
    return this.client.send('security.refresh', token).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
