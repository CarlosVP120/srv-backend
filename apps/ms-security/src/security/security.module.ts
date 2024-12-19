import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { JwtModule } from '@nestjs/jwt';
import { environments } from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Module({
  controllers: [SecurityController],
  providers: [SecurityService],
  imports: [
    JwtModule.register({
      global: true,
      secret: environments.jwtSecret,
      signOptions: {
        expiresIn: '1h',
        algorithm: 'HS256',
        issuer: 'iDrall',
        subject: 'iDrall API Token',
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class SecurityModule {}
