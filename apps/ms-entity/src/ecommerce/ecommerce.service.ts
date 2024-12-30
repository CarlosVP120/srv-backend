import { Injectable } from '@nestjs/common';
import { Like, In } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { DatabaseConnectionService } from '../database/database-connection.service';
import { UpsertEntityDto } from '../entity/dto/upsert-entity.dto';
import { GetEntityDto } from '../entity/dto/get-entity.dto';
import { Producto } from '../entities/producto.entity';
import { ProductoClasifica } from '../entities/producto_clasifica.entity';

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

      const [products, total] = await dataSource
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

      // Get all unique category IDs from the products
      const categoryIds = new Set<string>();
      products.forEach((product) => {
        const categorias = product.CLASIFICA_JSON?.CATEGORIA || [];
        categorias.forEach((id) => categoryIds.add(id));
      });

      // Fetch all categories in a single query if there are any category IDs
      const categories =
        categoryIds.size > 0
          ? await dataSource.getRepository(ProductoClasifica).find({
              where: {
                ID: In([...categoryIds]),
              },
            })
          : [];

      // Create a map of category ID to category name
      const categoryMap = new Map(
        categories.map((cat) => [cat.ID, cat.NOMBRE]),
      );

      // Transform the response to include category names in CLASIFICA_JSON
      const data = products.map((product) => {
        const categoriaIds = product.CLASIFICA_JSON?.CATEGORIA || [];

        return {
          ...product,
          CLASIFICA_JSON: {
            ...product.CLASIFICA_JSON,
            CATEGORIA: categoriaIds.map((id) => ({
              id,
              nombre: categoryMap.get(id) || '',
            })),
          },
        };
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
