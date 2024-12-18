import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EntityService } from './entity.service';
import { UpsertEntityDto } from './dto/upsert-entity.dto';
import { GetEntityDto } from './dto/get-entity.dto';

@Controller()
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @MessagePattern('entity.list')
  async listEntities() {
    return this.entityService.listEntities();
  }

  @MessagePattern('entity.get')
  async getEntity(@Payload() getEntityDto: GetEntityDto) {
    return this.entityService.getEntity(getEntityDto);
  }

  @MessagePattern('entity.upsert')
  async upsertEntity(@Payload() upsertEntityDto: UpsertEntityDto) {
    return this.entityService.upsertEntity(upsertEntityDto);
  }

  @MessagePattern('entity.delete')
  async deleteEntity(@Payload() payload: { entidad: string; id: string }) {
    return this.entityService.deleteEntity(payload.entidad, payload.id);
  }
}
