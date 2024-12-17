import { NestFactory } from '@nestjs/core';
import { MsSecurityModule } from './ms-security.module';

async function bootstrap() {
  const app = await NestFactory.create(MsSecurityModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
