import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { ChatController } from 'src/chat/chat.controller';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChatService } from 'src/chat/chat.service';
import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { Channel } from './entities/channel.entity';

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
        ChatController,
    ],
    exports: [
        ChatService,
        TypeOrmModule.forFeature([Chat, Channel]),
    ],
    controllers: [
      ChatController,
    ]
})
export class ChatModule {}