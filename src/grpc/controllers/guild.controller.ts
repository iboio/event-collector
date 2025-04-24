import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcGuildService } from '../services/guild.service';
import { GetGuildRequest, GetGuildResponse } from '../interfaces/guild.interface';

@Controller()
export class GrpcGuildController {
  constructor(private readonly guildService: GrpcGuildService) {}

  @GrpcMethod('Guild', 'GetGuilds')
  async getGuilds(data: GetGuildRequest): Promise<GetGuildResponse> {
    return this.guildService.getGuilds(data);
  }
}
