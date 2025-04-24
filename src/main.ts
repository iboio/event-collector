import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3050;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50000',
      package: 'discord',
      protoPath: join(process.cwd(), 'proto/discord.proto'),
    },
  });
  app.enableShutdownHooks();
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
  await app.startAllMicroservices();
  console.log(port);
  await app.listen(port);
}

bootstrap();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
