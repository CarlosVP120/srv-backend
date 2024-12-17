import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SecurityService } from './security.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @MessagePattern('security.login')
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.securityService.login(loginUserDto);
  }

  @MessagePattern('security.refresh')
  refresh(@Payload() token: string) {
    return this.securityService.refresh(token);
  }
}
