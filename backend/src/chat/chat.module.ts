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

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Chat, Channel]),
        UsersModule,
        JwtModule,
    ],
    providers: [
        ChatGateway,
        ChatService,
        AuthService,
        ChannelService
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