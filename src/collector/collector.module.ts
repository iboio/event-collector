import { Module } from '@nestjs/common';
import { MessageEventCollector } from './collectors/message';
import { VoiceEventCollector } from './collectors/voice';
import { JetstreamModule } from '../jetstream/jetstream.module';
import { BotModule } from '../bot/bot.module';
import { UserEventCollector } from './collectors/user';
import { CollectorController } from './collector.controller';

@Module({
  imports: [JetstreamModule, BotModule],
  providers: [MessageEventCollector, VoiceEventCollector, UserEventCollector],
  controllers: [CollectorController],
})
export class CollectorModule {}
