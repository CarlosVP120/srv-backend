import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EcommerceService } from './ecommerce.service';
import { UpsertEntityDto } from '../entity/dto/upsert-entity.dto';
import { GetEntityDto } from '../entity/dto/get-entity.dto';

@Controller()
export class EcommerceController {
  constructor(private readonly ecommerceService: EcommerceService) {}

  @MessagePattern('ecommerce.getProducts')
  async getProducts(@Payload() getEntityDto: GetEntityDto) {
    return this.ecommerceService.getProducts(getEntityDto);
  }
}
