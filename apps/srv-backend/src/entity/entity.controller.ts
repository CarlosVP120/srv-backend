import { Controller, Get, Post, Body, Inject, UseGuards } from '@nestjs/common';

import { NATS_SERVICE } from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { GetEntityDto } from './dto/get-entity.dto';
import { UpsertEntityDto } from './dto/upsert-entity.dto';
import { catchError } from 'rxjs';
import { SecurityGuard } from '../security/security.guard';

@Controller('entity')
export class EntityController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(SecurityGuard)
  @Get('list')
  listEntities() {
    return this.client.send('entity.list', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(SecurityGuard)
  @Post('get')
  get(@Body() getEntityDto: GetEntityDto) {
    return this.client.send('entity.get', getEntityDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(SecurityGuard)
  @Post('upsert')
  upsert(@Body() upsertEntityDto: UpsertEntityDto) {
    return this.client.send('entity.upsert', upsertEntityDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
