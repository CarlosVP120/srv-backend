import { Module } from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import { DatabaseModule } from '../database/database.module';
import { EcommerceController } from './ecommerce.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [EcommerceController],
  providers: [EcommerceService],
})
export class EcommerceModule {}
