import { Module } from '@nestjs/common';
import { JetstreamService } from './jetstream.service';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
@Module({
  imports: [
    ConfigModule.forRoot(),
    NatsJetStreamTransport.register({
      connectionOptions: {
        servers: `${process.env.NATS_HOST}:${process.env.NATS_PORT}`,
        name: 'event-collector',
      },
    }),
  ],
  providers: [JetstreamService],
  exports: [JetstreamService],
})
export class JetstreamModule {}
