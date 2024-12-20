import { Controller, Get, Post, Body, Inject, UseGuards } from '@nestjs/common';

import { NATS_SERVICE } from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { SecurityGuard } from '../security/security.guard';
import { GetEntityDto } from '../entity/dto/get-entity.dto';

@Controller('ecommerce')
export class EcommerceController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(SecurityGuard)
  @Post('getProducts')
  getProducts(@Body() getEntityDto: GetEntityDto) {
    return this.client.send('ecommerce.getProducts', getEntityDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
