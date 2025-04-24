import { Injectable } from '@nestjs/common';
import { Client, ClientEvents } from 'discord.js';
import { Context, On } from 'necord';
import { JetstreamService } from '../../jetstream/jetstream.service';
import { UserProfileChange } from '../../dto/user';

const USER_PFP = 'event.user.pfp';

@Injectable()
export class UserEventCollector {
  constructor(
    private readonly client: Client,
    private readonly jetStreamService: JetstreamService,
  ) {}

  @On('userUpdate')
  public async onUserUpdate([oldUser, newUser]: ClientEvents['userUpdate']) {
    const oldAvatar = oldUser.avatar;
    const newAvatar = newUser.avatar;

    if (oldAvatar !== newAvatar) {
      await this.jetStreamService.publishMessage<UserProfileChange>(USER_PFP, {
        userId: newUser.id,
        avatarHash: newAvatar,
      });
    }
  }
}
