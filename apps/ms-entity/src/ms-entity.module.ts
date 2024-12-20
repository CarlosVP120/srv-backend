import { Module } from '@nestjs/common';
import { EntityModule } from './entity/entity.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';

@Module({
  imports: [EntityModule, EcommerceModule],
  controllers: [],
  providers: [],
})
export class MsEntityModule {}
