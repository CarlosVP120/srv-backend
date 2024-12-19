import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { environments } from '../config';
import { User } from 'apps/ms-security/src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoUtil } from '../shared/utils/crypto.util';

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
    const exist = await this.userRepository.findOne({
      where: { EMAIL: loginUserDto.email },
    });

    if (!exist) {
      throw new RpcException({
        status: 400,
        message: 'User not found',
      });
    }

    const decryptedStoredPass = CryptoUtil.decryptString(exist.PASS);
    const isMatch = loginUserDto.password === decryptedStoredPass;

    if (!isMatch) {
      throw new RpcException({
        status: 401,
        message: 'Invalid credentials',
      });
    }

    const jwtContent = {
      userLink: exist.ID,
      isSuper: exist.ISSUPERVISOR,
    };

    return {
      id: exist.ID,
      token: this.signJwt(jwtContent),
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
        iss: _____,
        sub: ______,
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
      const users = await this.userRepository.find();

      return users.map((user) => {
        const { PASS: _, ...rest } = user;
        return rest;
      });
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { EMAIL: email },
      });

      // Separate PASS from user
      const { PASS: _, ...rest } = user;

      return rest;
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
