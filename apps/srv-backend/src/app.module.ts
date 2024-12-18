import { Module } from '@nestjs/common';
import { SecurityModule } from './security/security.module';
import { EntityModule } from './entity/entity.module';

@Module({
  imports: [SecurityModule, EntityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
