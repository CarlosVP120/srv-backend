import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './security.guard';
import { NATS_SERVICE } from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { User } from '../common/decorators/user.decorator';

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

  @UseGuards(AuthGuard)
  @Get('refresh')
  refresh(@User() user: { token: string }) {
    return this.client.send('security.refresh', user.token).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
