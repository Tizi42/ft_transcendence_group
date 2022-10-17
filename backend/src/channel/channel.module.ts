import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { User } from 'src/users/users.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { Channel } from './entities/channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChannelGateway } from './channel.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { Battle } from 'src/battles/battle.entity';
import { BattlesService } from 'src/battles/battles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chat, Channel, Battle]),
    UsersModule,
    ChatModule,
  ],
  providers: [
    ChannelService, 
    ChannelGateway,
    BattlesService,
  ],
  exports: [
    ChannelService,
    TypeOrmModule.forFeature([Channel]),
  ],
  controllers: [ChannelController],
})
export class ChannelModule {}
