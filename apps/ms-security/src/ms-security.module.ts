import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    SecurityModule,
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: 'srv-data',
      port: 1521,
      username: 'IDRALL_COMMON',
      password: '1DrallN3w23',
      serviceName: 'idrallpdb1.db.net',
      autoLoadEntities: true,
      synchronize: false,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    }),
  ],
  controllers: [],
  providers: [],
})
export class MsSecurityModule {}
