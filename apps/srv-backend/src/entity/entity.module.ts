import { Module } from '@nestjs/common';
import { EntityController } from './entity.controller';
import { NatsModule } from '../transports/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [EntityController],
  providers: [],
})
export class EntityModule {}
