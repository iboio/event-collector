import { Controller, Param, Post } from '@nestjs/common';
import { Client } from 'discord.js';
import { JetstreamService } from '../jetstream/jetstream.service';
const USER_PFP = 'event.user.pfp';
@Controller('manual')
export class CollectorController {
  constructor(
    private readonly client: Client,
    private readonly jetstreamService: JetstreamService,
  ) {}
  @Post('userProfileUrl/:guildId')
  async userProfileUrl(@Param('guildId') guildId: string) {
    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) {
      throw new Error(`Guild with ID ${guildId} not found`);
    }
    const members = await guild.members.fetch();
    if (!members) {
      throw new Error(`Member with ID ${guildId} not found`);
    }
    members.forEach((member) => {
      const userId = member.user.id;
      const avatarHash = member.user.avatar;
      this.jetstreamService.publishMessage(USER_PFP, {
        userId,
        avatarHash,
      });
    });
    return { message: 'User profile URLs published successfully' };
  }
}
