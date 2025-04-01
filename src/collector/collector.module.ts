import { Module } from '@nestjs/common';
import { MessageEventCollector } from './collectors/message';
import { VoiceEventCollector } from './collectors/voice';
import { JetstreamModule } from '../jetstream/jetstream.module';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [JetstreamModule, BotModule],
  providers: [MessageEventCollector, VoiceEventCollector],
})
export class CollectorModule {}
