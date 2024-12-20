import { Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { DatabaseConnectionService } from '../database/database-connection.service';
import { UpsertEntityDto } from '../entity/dto/upsert-entity.dto';
import { GetEntityDto } from '../entity/dto/get-entity.dto';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class EcommerceService {
  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  async getProducts(getEntityDto: GetEntityDto) {
    try {
      const { params, empresalink } = getEntityDto;
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
        .getRepository(Producto)
        .findAndCount({
          where: processedFilter,
          order: order ? JSON.parse(order) : undefined,
          skip: (page - 1) * pagesize,
          take: pagesize,
          relations: {
            variants: true,
          },
        });

      return {
        data,
        info: {
          total,
          page,
          pagesize,
          pages: Math.ceil(total / pagesize),
        },
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
