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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chat, Channel]),
    UsersModule,
    ChatModule,
  ],
  providers: [
    ChannelService, 
    ChannelGateway,
  ],
  exports: [
    ChannelService,
    TypeOrmModule.forFeature([Channel]),
  ],
  controllers: [ChannelController],
})
export class ChannelModule {}
