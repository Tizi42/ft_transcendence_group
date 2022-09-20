import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/Users.entity';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './message.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Message]),
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
        TypeOrmModule.forFeature([Message]),
    ],
})
export class ChatModule {}
