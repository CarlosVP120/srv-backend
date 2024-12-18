import { NestFactory } from '@nestjs/core';
import { MsSecurityModule } from './ms-security.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { environments } from './config';
import { BufferToHexInterceptor } from './shared/interceptors/buffer-to-hex.interceptor';

async function bootstrap() {
  const logger = new Logger('Security-Microservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MsSecurityModule,
    {
      transport: Transport.NATS,
      options: {
        servers: environments.natsServer,
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new BufferToHexInterceptor());

  await app.listen();

  logger.log(
    `Security Microservice started, listening on ${environments.natsServer}`,
  );
}
bootstrap();
