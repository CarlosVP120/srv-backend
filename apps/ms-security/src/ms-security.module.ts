import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { TypeOrmModule } from '@nestjs/typeorm';

console.log(__dirname + '/entities/*.entity.js');

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
    }),
  ],
  controllers: [],
  providers: [],
})
export class MsSecurityModule {}
