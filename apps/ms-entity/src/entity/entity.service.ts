import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Like } from 'typeorm';
import { GetEntityDto } from './dto/get-entity.dto';
import { UpsertEntityDto } from './dto/upsert-entity.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EntityService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getEntity(getEntityDto: GetEntityDto) {
    try {
      const { entidad, params } = getEntityDto;
      const { order, filter, pagesize = 10, page = 1 } = params;

      // Process filter to use Like operator for string values with %
      const processedFilter = {};
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (typeof value === 'string' && value.includes('%')) {
            processedFilter[key] = Like(value);
          } else {
            processedFilter[key] = value;
          }
        });
      }

      const [data, total] = await this.entityManager
        .getRepository(entidad)
        .findAndCount({
          where: processedFilter,
          order: order ? JSON.parse(order) : undefined,
          skip: (page - 1) * pagesize,
          take: pagesize,
        });

      return {
        data,
        total,
        page,
        pagesize,
        pages: Math.ceil(total / pagesize),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async upsertEntity(upsertEntityDto: UpsertEntityDto) {
    const { entidad, data, empresalink, sucursallink } = upsertEntityDto;

    // Add empresa and sucursal links to the data
    const entityData = {
      ...data,
      EMPRESALINK: empresalink,
      SUCURSALLINK: sucursallink,
    };

    // Use upsert operation
    const result = await this.entityManager
      .getRepository(entidad)
      .save(entityData);

    return result;
  }

  async deleteEntity(entidad: string, id: string) {
    const result = await this.entityManager.getRepository(entidad).delete(id);

    return result;
  }
}
