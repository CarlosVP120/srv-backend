import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { GetEntityDto } from './dto/get-entity.dto';
import { UpsertEntityDto } from './dto/upsert-entity.dto';
import { RpcException } from '@nestjs/microservices';
import { DatabaseConnectionService } from '../database/database-connection.service';

@Injectable()
export class EntityService {
  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  async listEntities() {
    try {
      // For listing entities, we'll use the IDRALL_COMMON connection
      const dataSource =
        await this.databaseConnectionService.getConnection('IDRALL_COMMON');
      const entities = dataSource.entityMetadatas.map((metadata) => ({
        name: metadata.tableName,
        columns: metadata.columns.map((column) => ({
          name: column.databaseName,
          type: column.type,
          isNullable: column.isNullable,
          isPrimary: column.isPrimary,
        })),
      }));

      return entities;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async getEntity(getEntityDto: GetEntityDto) {
    try {
      const { entidad, params, empresalink } = getEntityDto;
      const { order, filter, pagesize = 10, page = 1 } = params;

      // Get the connection for this empresa
      const dataSource =
        await this.databaseConnectionService.getConnection(empresalink);

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

      const [data, total] = await dataSource
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

    try {
      // Get the connection for this empresa
      const dataSource =
        await this.databaseConnectionService.getConnection(empresalink);

      // Add empresa and sucursal links to the data
      const entityData = {
        ...data,
        EMPRESALINK: empresalink,
        SUCURSALLINK: sucursallink,
      };

      // Use upsert operation
      const result = await dataSource.getRepository(entidad).save(entityData);

      return result;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async deleteEntity(entidad: string, id: string, empresalink: string) {
    try {
      // Get the connection for this empresa
      const dataSource =
        await this.databaseConnectionService.getConnection(empresalink);

      const result = await dataSource.getRepository(entidad).delete(id);

      return result;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
