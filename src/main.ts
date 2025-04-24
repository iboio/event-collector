import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50050',
      package: 'discord',
      protoPath: join(process.cwd(), 'proto/discord.proto'),
    },
  });
  app.enableShutdownHooks();
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  await app.startAllMicroservices();
  await app.listen(port);
}

bootstrap();
