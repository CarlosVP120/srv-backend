import { Module } from '@nestjs/common';
import { DatabaseConnectionService } from './database-connection.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE } from '../config';
import { environments } from '../config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: [environments.natsServer],
        },
      },
    ]),
  ],
  providers: [DatabaseConnectionService],
  exports: [DatabaseConnectionService],
})
export class DatabaseModule {}
