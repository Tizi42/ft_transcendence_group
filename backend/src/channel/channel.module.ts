import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { User } from 'src/users/users.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { Channel } from './entities/channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelGateway } from './channel.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { Battle } from 'src/battles/battle.entity';
import { BattlesService } from 'src/battles/battles.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chat, Channel, Battle]),
    ChatModule,
  ],
  providers: [
    ChannelService, 
    ChannelGateway,
    BattlesService,
    UsersService,
  ],
  exports: [
    ChannelService,
    TypeOrmModule.forFeature([Channel]),
  ],
  controllers: [ChannelController],
})
export class ChannelModule {}
