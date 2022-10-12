import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelService } from 'src/channel/channel.service';
import { User } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Channel } from './entities/channel.entity';
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