import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from 'src/channel/entities/channel.entity';
import { User } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { Battle } from 'src/battles/battle.entity';
import { BattlesService } from 'src/battles/battles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Chat, Channel, Battle]),
        UsersModule,
        JwtModule,
    ],
    providers: [
        ChatGateway,
        ChatService,
        AuthService,
        ChannelService,
        BattlesService
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