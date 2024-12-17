import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { JwtModule } from '@nestjs/jwt';
import { environments } from '../config';

@Module({
  controllers: [SecurityController],
  providers: [SecurityService],
  imports: [
    JwtModule.register({
      global: true,
      secret: environments.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class SecurityModule {}
