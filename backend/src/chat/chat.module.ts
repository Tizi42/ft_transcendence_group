import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Chat]),
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
})
export class ChatModule {}