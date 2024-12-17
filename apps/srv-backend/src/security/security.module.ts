import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { NatsModule } from '../transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [SecurityController],
  providers: [],
})
export class SecurityModule {}
