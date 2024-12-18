import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EntityService } from './entity.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';

@Controller()
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @MessagePattern('createEntity')
  create(@Payload() createEntityDto: CreateEntityDto) {
    return this.entityService.create(createEntityDto);
  }

  @MessagePattern('findAllEntity')
  findAll() {
    return this.entityService.findAll();
  }

  @MessagePattern('findOneEntity')
  findOne(@Payload() id: number) {
    return this.entityService.findOne(id);
  }

  @MessagePattern('updateEntity')
  update(@Payload() updateEntityDto: UpdateEntityDto) {
    return this.entityService.update(updateEntityDto.id, updateEntityDto);
  }

  @MessagePattern('removeEntity')
  remove(@Payload() id: number) {
    return this.entityService.remove(id);
  }
}
