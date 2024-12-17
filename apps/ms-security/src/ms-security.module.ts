import { Module } from '@nestjs/common';
import { MsSecurityController } from './ms-security.controller';
import { MsSecurityService } from './ms-security.service';

@Module({
  imports: [],
  controllers: [MsSecurityController],
  providers: [MsSecurityService],
})
export class MsSecurityModule {}
