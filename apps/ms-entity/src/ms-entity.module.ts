import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityModule } from './entity/entity.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: 'srv-data',
      port: 1521,
      username: 'IDRALL_ECOMMERCE',
      password: '1DrallN3w23',
      serviceName: 'idrallpdb1.db.net',
      autoLoadEntities: true,
      synchronize: false,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    }),
    EntityModule,
  ],
  controllers: [],
  providers: [],
})
export class MsEntityModule {}
