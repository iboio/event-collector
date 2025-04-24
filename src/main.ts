import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { default as proxy } from 'node-global-proxy';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3050;
  const proxyUrl = process.env.PROXY_URL;
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
  console.log(port);
  proxy.setConfig({
    http: proxyUrl,
    https: proxyUrl,
  });
  proxy.start();
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
