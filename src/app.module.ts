import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as process from 'process';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { ConfigModule } from '@nestjs/config';
import { JetstreamModule } from './jetstream/jetstream.module';
import { CollectorModule } from './collector/collector.module';
import { BotModule } from './bot/bot.module';
import { ProxyAgent } from 'undici';
import { GrpcModule } from './grpc/grpc.module';

@Module({
  imports: [
    NecordModule.forRoot({
      token: process.env.DISCORD_BOT_TOKEN,
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMessageTyping,
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JetstreamModule,
    CollectorModule,
    BotModule,
    GrpcModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
