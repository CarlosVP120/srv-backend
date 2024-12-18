import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { environments } from '../config';
import { User } from 'apps/ms-security/src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

const fakeUsers = [
  {
    id: '1',
    email: 'carlos@gmail.com',
    password: '123456',
  },
  {
    id: '2',
    email: 'carlos@gmail.com',
    password: '123456',
  },
];

@Injectable()
export class SecurityService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const exist = fakeUsers.find((user) => user.email === loginUserDto.email);

    if (!exist) {
      throw new RpcException({
        status: 400,
        message: 'User not found',
      });
    }

    const isMatch = loginUserDto.password === exist.password;

    if (!isMatch) {
      throw new RpcException({
        status: 401,
        message: 'Invalid credentials',
      });
    }

    const { password: _, ...rest } = exist;

    return {
      user: rest,
      token: this.signJwt(rest),
    };
  }

  async verify(token: string) {
    try {
      const {
        sub: _,
        iat: __,
        exp: ___,
        ...user
      } = this.jwtService.verify(token, {
        secret: environments.jwtSecret,
      });

      return {
        user,
        token,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
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

      return {
        user,
        token: this.signJwt(user),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findAllUsers() {
    try {
      return this.userRepository.find();
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  signJwt(payload: any) {
    return this.jwtService.sign(payload);
  }
}
