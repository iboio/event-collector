import { Injectable, Logger } from '@nestjs/common';
import { Once, On, Context, ContextOf } from 'necord';
import { Client, TextChannel, VoiceChannel } from 'discord.js';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);
  constructor(private readonly client: Client) {}

  @Once('ready')
  public onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`Bot logged in as ${client.user.username}`);
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }

  async getChannelName(channelId: string) {
    const channel = this.client.channels.cache.get(channelId);
    if (channel instanceof TextChannel) {
      return channel.name;
    }
    if (channel instanceof VoiceChannel) {
      return channel.name;
    }
  }
}
