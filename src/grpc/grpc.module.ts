import { Module } from '@nestjs/common';
import { GrpcGuildController } from './controllers/guild.controller';
import { GrpcGuildService } from './services/guild.service';
import { BotModule } from "../bot/bot.module";

@Module({
  imports: [BotModule],
  controllers: [GrpcGuildController],
  providers: [GrpcGuildService],
  exports: [GrpcGuildService],
})
export class GrpcModule {}
