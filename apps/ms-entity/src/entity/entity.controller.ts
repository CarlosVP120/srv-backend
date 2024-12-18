import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EntityService } from './entity.service';

@Controller()
export class EntityController {
  constructor(private readonly entityService: EntityService) {}
}
