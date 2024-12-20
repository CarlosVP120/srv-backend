import {
  Controller,
  Post,
  Body,
  Inject,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
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
  @Get('refresh')
  refresh(@Token() token: string) {
    return this.client.send('security.refresh', token).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(SecurityGuard)
  @Get('users')
  findAllUsers() {
    return this.client.send('security.findAllUsers', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(SecurityGuard)
  @Get('user/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.client.send('security.findUserByEmail', email).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(SecurityGuard)
  @Get('access')
  getAccess(@Token() token: string) {
    return this.client.send('security.getAccess', token).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
