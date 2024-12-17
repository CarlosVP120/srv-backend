import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { environments } from '../config';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SecurityService {
  constructor(private readonly jwtService: JwtService) {
    // super();
  }

  async login(loginUserDto: LoginUserDto) {
    return { loginUserDto };
  }

  async refresh(token: string) {
    try {
      const {
        sub: _,
        iat: __,
        exp: ___,
        ...user
      } = this.jwtService.verify(token, {
        secret: environments.jwtSecret,
      });

      return { user, token: this.signJwt(user) };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  signJwt(payload: IJwtPayload) {
    return this.jwtService.sign(payload);
  }
}
