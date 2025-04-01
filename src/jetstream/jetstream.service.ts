import { Injectable, OnModuleInit } from '@nestjs/common';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Injectable()
export class JetstreamService implements OnModuleInit {
  constructor(private client: NatsJetStreamClientProxy) {}

  async onModuleInit() {
    console.log('Checking NATS connection...');
    const isConnected = this.client.connect();
    if (!isConnected) {
      console.error('❌ NATS connection failed.');
    } else {
      console.log('✅ NATS connected.');
    }
  }

  async publishMessage<T>(stream: string, data: any) {
    try {
      this.client.emit<T>(stream, data);
    } catch (error) {
      console.error(error);
    }
  }
}
