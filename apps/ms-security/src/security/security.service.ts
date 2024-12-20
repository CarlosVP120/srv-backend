import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { environments } from '../config';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CryptoUtil } from '../shared/utils/crypto.util';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioEmpresaSucursal } from '../entities/usuario_empresa_sucursal.entity';
import { Empresa } from '../entities/empresa.entity';
import { Sucursal } from '../entities/sucursal.entity';
import { AccessResponseDto } from './dto/access-response.dto';

@Injectable()
export class SecurityService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const exist = await this.entityManager.findOne(Usuario, {
      where: { EMAIL: loginUserDto.email },
    });

    if (!exist) {
      throw new RpcException({
        status: 400,
        message: 'User not found',
      });
    }

    const decryptedStoredPass = CryptoUtil.decryptString(exist.PASS);
    const isMatch = loginUserDto.pass === decryptedStoredPass;

    if (!isMatch) {
      throw new RpcException({
        status: 401,
        message: 'Invalid credentials',
      });
    }

    const jwtContent = {
      userLink: exist.ID,
      isSuper: exist.ISSUPERVISOR,
    };

    return {
      id: exist.ID,
      token: this.signJwt(jwtContent),
    };

    // try {
    //   const entities = this.entityManager.connection.entityMetadatas.map(
    //     (metadata) => ({
    //       name: metadata.tableName,
    //       columns: metadata.columns.map((column) => ({
    //         name: column.databaseName,
    //         type: column.type,
    //         isNullable: column.isNullable,
    //         isPrimary: column.isPrimary,
    //       })),
    //     }),
    //   );

    //   return entities;
    // } catch (error) {
    //   throw new RpcException({
    //     status: 400,
    //     message: error.message,
    //   });
    // }
  }

  async verify(token: string) {
    try {
      const {
        sub: _,
        iat: __,
        exp: ___,
        ...user
      } = this.jwtService.verify(token, {
        secret: environments.jwtSecret,
      });

      return {
        user,
        token,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async refresh(token: string) {
    try {
      const {
        sub: _,
        iat: __,
        exp: ___,
        iss: _____,
        sub: ______,
        ...user
      } = this.jwtService.verify(token, {
        secret: environments.jwtSecret,
      });

      return {
        user,
        token: this.signJwt(user),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findAllUsers() {
    try {
      const users = await this.entityManager.find(Usuario);

      return users.map((user) => {
        const { PASS: _, ...rest } = user;
        return rest;
      });
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.entityManager.findOne(Usuario, {
        where: { EMAIL: email },
      });

      // Separate PASS from user
      const { PASS: _, ...rest } = user;

      return rest;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async getAccess(token: string): Promise<AccessResponseDto> {
    try {
      const { userLink, isSuper } = this.jwtService.verify(token, {
        secret: environments.jwtSecret,
      });

      // Get all companies and their branches that the user has access to
      const query = this.entityManager
        .createQueryBuilder(Empresa, 'e')
        .select(['e.ID', 'e.NOMBRE', 'e.STATUS']);

      if (!isSuper) {
        // For regular users, only get companies they have access to
        query.innerJoin(
          UsuarioEmpresaSucursal,
          'ues',
          'ues.EMPRESALINK = e.ID AND ues.USUARIOLINK = :userLink',
          { userLink },
        );
      }

      const empresas = await query.getMany();

      // For each company, get its branches
      const result = await Promise.all(
        empresas.map(async (empresa) => {
          const branchQuery = this.entityManager
            .createQueryBuilder(Sucursal, 's')
            .select(['s.ID', 's.NOMBRE', 's.CIUDAD', 's.STATUS'])
            .where('s.EMPRESALINK = :empresaId', { empresaId: empresa.ID });

          if (!isSuper) {
            branchQuery.innerJoin(
              UsuarioEmpresaSucursal,
              'ues',
              'ues.SUCURSALLINK = s.ID AND ues.USUARIOLINK = :userLink',
              { userLink },
            );
          }

          const sucursales = await branchQuery.getMany();

          return {
            id: empresa.ID,
            nombre: empresa.NOMBRE,
            status: empresa.STATUS,
            sucursal: sucursales.map((s) => ({
              id: s.ID,
              nombre: s.NOMBRE,
              ciudad: s.CIUDAD,
              status: s.STATUS,
            })),
          };
        }),
      );

      return {
        data: result,
      } as any; // Using any here to match the expected response format
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async getEmpresaInfo(empresalink: string) {
    try {
      const empresa = await this.entityManager.findOne(Empresa, {
        where: { ID: empresalink },
      });

      if (!empresa) {
        throw new RpcException({
          status: 404,
          message: 'Empresa not found',
        });
      }

      return empresa;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  signJwt(payload: any) {
    return this.jwtService.sign(payload);
  }
}
