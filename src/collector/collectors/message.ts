import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import { Context, ContextOf, On } from 'necord';
import { JetstreamService } from '../../jetstream/jetstream.service';
import {
  CreateMessage,
  DeletedMessage,
  UpdatedMessage,
} from '../../dto/message';
import { BotService } from '../../bot/bot.service';

const MESSAGE_EVENT = 'event.msg';
const MESSAGE_EVENT_DELETE = 'event.msg.delete';
const MESSAGE_EVENT_UPDATE = 'event.msg.edit';

@Injectable()
export class MessageEventCollector {
  constructor(
    private readonly client: Client,
    private readonly jetstreamService: JetstreamService,
    private readonly botService: BotService,
  ) {}

  @On('messageCreate')
  async collectMessage(@Context() [message]: ContextOf<'messageCreate'>) {
    if (message.author.bot) return;
    await this.jetstreamService.publishMessage<CreateMessage>(MESSAGE_EVENT, {
      guildId: message.guildId,
      channelId: message.channelId,
      channelName: await this.botService.getChannelName(message.channelId),
      userId: message.author.id,
      username: message.author.username,
      eventTime: Math.floor(message.createdTimestamp / 1000),
    });
  }

  @On('messageUpdate')
  async collectMessageUpdate(
    @Context() [oldMessage, newMessage]: ContextOf<'messageUpdate'>,
  ) {
    if (newMessage.author.bot) return;
    await this.jetstreamService.publishMessage<UpdatedMessage>(
      MESSAGE_EVENT_UPDATE,
      {
        guildId: newMessage.guildId,
        channelId: newMessage.channelId,
        channelName: await this.botService.getChannelName(newMessage.channelId),
        userId: newMessage.author.id,
        userAvatar: newMessage.author.avatarURL(),
        oldContent: oldMessage.content,
        username: oldMessage.author.username,
        newContent: newMessage.content,
        eventTime: Math.floor(newMessage.createdTimestamp / 1000),
      },
    );
  }

  @On('messageDelete')
  async collectMessageDelete(@Context() [message]: ContextOf<'messageDelete'>) {
    if (message.author.bot) return;
    await this.jetstreamService.publishMessage<DeletedMessage>(
      MESSAGE_EVENT_DELETE,
      {
        guildId: message.guildId,
        channelId: message.channelId,
        channelName: await this.botService.getChannelName(message.channelId),
        userId: message.author.id,
        userAvatar: message.author.avatarURL(),
        botId: this.client.user.id,
        username: message.author.username,
        content: message.content,
        eventTime: Math.floor(message.createdTimestamp / 1000),
      },
    );
  }
}
