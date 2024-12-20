import { Module } from '@nestjs/common';
import { NatsModule } from '../transports/nats.module';
import { EcommerceController } from './ecommerce.controller';

@Module({
  imports: [NatsModule],
  controllers: [EcommerceController],
  providers: [],
})
export class EcommerceModule {}
