import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { NATS_SERVICE } from '../config';
import { firstValueFrom } from 'rxjs';
import { join } from 'path';

interface ConnectionInfo {
  dataSource: DataSource;
  lastUsed: Date;
}

@Injectable()
export class DatabaseConnectionService
  implements OnModuleInit, OnModuleDestroy
{
  private connections: Map<string, ConnectionInfo> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor(
    @Inject(NATS_SERVICE) private readonly securityClient: ClientProxy,
  ) {
    // Cleanup unused connections every 5 minutes
    this.cleanupInterval = setInterval(
      () => this.cleanupUnusedConnections(),
      5 * 60 * 1000,
    );
  }

  async onModuleInit() {
    // Initialize the default IDRALL_COMMON connection
    await this.initializeDefaultConnection();
  }

  onModuleDestroy() {
    clearInterval(this.cleanupInterval);
    // Close all connections
    for (const [_, connection] of this.connections) {
      connection.dataSource.destroy();
    }
  }

  private async initializeDefaultConnection() {
    const options: DataSourceOptions = {
      type: 'oracle',
      host: 'srv-data',
      port: 1521,
      username: 'IDRALL_COMMON',
      password: '1DrallN3w23',
      serviceName: 'idrallpdb1.db.net',
      synchronize: false,
      entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
      connectString:
        '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=srv-data)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=idrallpdb1.db.net)))',
    };

    try {
      const dataSource = new DataSource(options);
      await dataSource.initialize();

      // Store the connection
      this.connections.set('IDRALL_COMMON', {
        dataSource,
        lastUsed: new Date(),
      });
    } catch (error) {
      throw new RpcException({
        status: 500,
        message: 'Failed to create default database connection',
      });
    }
  }

  private async cleanupUnusedConnections() {
    const now = new Date();
    const expirationTime = 15 * 60 * 1000; // 15 minutes in milliseconds

    for (const [empresalink, connection] of this.connections) {
      // Don't cleanup the default connection
      if (empresalink === 'IDRALL_COMMON') continue;

      const timeSinceLastUse = now.getTime() - connection.lastUsed.getTime();
      if (timeSinceLastUse > expirationTime) {
        await connection.dataSource.destroy();
        this.connections.delete(empresalink);
      }
    }
  }

  private async getEmpresaInfo(empresalink: string): Promise<any> {
    try {
      const empresa = await firstValueFrom(
        this.securityClient.send('security.getEmpresaInfo', empresalink),
      );
      return empresa;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: 'Failed to get empresa information',
      });
    }
  }

  async getConnection(empresalink: string): Promise<DataSource> {
    // Check if we have an existing connection
    const existingConnection = this.connections.get(empresalink);
    if (existingConnection) {
      // Update last used time
      existingConnection.lastUsed = new Date();
      return existingConnection.dataSource;
    }

    // Get empresa information from security microservice
    const empresa = await this.getEmpresaInfo(empresalink);

    const options: DataSourceOptions = {
      type: 'oracle',
      host: empresa.SERVICE_NAME,
      port: empresa.PUERTO,
      username: empresa.DBUSER,
      password: empresa.DBPASS,
      serviceName: empresa.SERVIDOR.split('/')[1],
      synchronize: false,
      entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    };

    // Create and initialize the connection
    try {
      const dataSource = new DataSource(options);
      await dataSource.initialize();

      // Store the connection
      this.connections.set(empresalink, {
        dataSource,
        lastUsed: new Date(),
      });

      return dataSource;
    } catch (error) {
      throw new RpcException({
        status: 500,
        message: 'Failed to create database connection',
      });
    }
  }
}
