import { Injectable } from '@nestjs/common';
import {
  GetGuildRequest,
  GetGuildResponse,
  GuildInfo,
} from '../interfaces/guild.interface';
import { Client } from 'discord.js';
import { BotService } from '../../bot/bot.service';

@Injectable()
export class GrpcGuildService {
  constructor(private readonly botService: BotService) {}

  async getGuilds(data: GetGuildRequest): Promise<GetGuildResponse> {
    const discordGuilds = await this.botService.getGuildId();
    const guilds: GuildInfo[] = [];
    discordGuilds.map((guild) => {
      guilds.push({
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL() || '',
      });
    });

    return { guilds };
  }
}
