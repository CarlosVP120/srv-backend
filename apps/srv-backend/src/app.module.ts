import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { EntityModule } from './entity/entity.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';

@Module({
  imports: [SecurityModule, EntityModule, EcommerceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
