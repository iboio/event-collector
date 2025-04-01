import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import { JetstreamService } from '../../jetstream/jetstream.service';
import { Context, ContextOf, On } from 'necord';
import { BotService } from '../../bot/bot.service';
import { VoiceStateSwitch, VoiceStateUpdate } from '../../dto/voice';

const VOICE_PROCESS = 'event.voice.process';
const VOICE_EVENT_LOG = 'event.voice.log';

@Injectable()
export class VoiceEventCollector {
  constructor(
    private readonly client: Client,
    private readonly jetstreamService: JetstreamService,
    private readonly botService: BotService,
  ) {}

  @On('voiceStateUpdate')
  async voiceStateUpdate(
    @Context() [oldState, newState]: ContextOf<'voiceStateUpdate'>,
  ) {
    if (oldState.channelId && !newState.channelId) {
      const data = {
        type: 'left',
        guildId: oldState.guild.id,
        channelId: oldState.channelId,
        channelName: await this.botService.getChannelName(oldState.channelId),
        userId: oldState.member.user.id,
        profileUrl: oldState.member.user.avatarURL(),
        username: oldState.member.user.username,
        eventTime: Math.floor(Date.now() / 1000),
      } as VoiceStateUpdate;
      await this.jetstreamService.publishMessage<VoiceStateUpdate>(
        VOICE_EVENT_LOG,
        data,
      );
      await this.jetstreamService.publishMessage<VoiceStateUpdate>(
        VOICE_PROCESS,
        data,
      );
    } else if (newState.channelId && !oldState.channelId) {
      const data = {
        type: 'join',
        guildId: newState.guild.id,
        channelId: newState.channelId,
        channelName: await this.botService.getChannelName(newState.channelId),
        userId: newState.member.user.id,
        username: newState.member.user.username,
        eventTime: Math.floor(Date.now() / 1000),
      } as VoiceStateUpdate;
      await this.jetstreamService.publishMessage<VoiceStateUpdate>(
        VOICE_EVENT_LOG,
        data,
      );
      await this.jetstreamService.publishMessage<VoiceStateUpdate>(
        VOICE_PROCESS,
        data,
      );
    } else if (
      oldState.channelId &&
      newState.channelId &&
      oldState.channelId !== newState.channelId
    ) {
      const data = {
        type: 'switch',
        guildId: newState.guild.id,
        newChannelId: newState.channelId,
        newChannelName: await this.botService.getChannelName(
          newState.channelId,
        ),
        oldChannelId: oldState.channelId,
        oldChannelName: await this.botService.getChannelName(
          oldState.channelId,
        ),
        profileUrl: newState.member.user.avatarURL(),
        userId: newState.member.user.id,
        username: newState.member.user.username,
        eventTime: Math.floor(Date.now() / 1000),
      } as VoiceStateSwitch;
      await this.jetstreamService.publishMessage<VoiceStateSwitch>(
        VOICE_EVENT_LOG,
        data,
      );
      await this.jetstreamService.publishMessage<VoiceStateSwitch>(
        VOICE_EVENT_LOG,
        data,
      );
    }
  }
}
