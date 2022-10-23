import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from 'src/channel/entities/channel.entity';
import { User } from 'src/users/users.entity';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { Battle } from 'src/battles/battle.entity';
import { BattlesService } from 'src/battles/battles.service';
import { UsersService } from 'src/users/users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Chat, Channel, Battle]),
        JwtModule,
    ],
    providers: [
        ChatGateway,
        ChatService,
        AuthService,
        ChannelService,
        BattlesService,
        UsersService,
    ],
    exports: [
        ChatService,
        TypeOrmModule.forFeature([Chat]),
    ],
    controllers: [
      ChatController,
    ]
})
export class ChatModule {}