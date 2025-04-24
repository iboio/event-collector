import { Injectable, Logger } from '@nestjs/common';
import { Context, ContextOf, On, Once } from 'necord';
import {
  Client,
  Collection,
  Guild,
  TextChannel,
  VoiceChannel,
} from 'discord.js';

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

  async getGuildId(): Promise<Collection<string, Guild>> {
    return this.client.guilds.cache;
  }
}
