import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SecurityService } from './security.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  // Login user
  @MessagePattern('security.login')
  login(@Payload() loginUserDto: LoginUserDto) {
    return this.securityService.login(loginUserDto);
  }

  // Verify the token
  @MessagePattern('security.verify')
  verify(@Payload() token: string) {
    return this.securityService.verify(token);
  }

  @MessagePattern('security.refresh')
  refresh(@Payload() token: string) {
    return this.securityService.refresh(token);
  }

  @MessagePattern('security.findAllUsers')
  findAllUsers() {
    return this.securityService.findAllUsers();
  }

  @MessagePattern('security.findUserByEmail')
  findUserByEmail(@Payload() email: string) {
    return this.securityService.findUserByEmail(email);
  }
}
