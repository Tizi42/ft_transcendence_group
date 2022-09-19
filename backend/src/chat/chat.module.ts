import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), UsersModule, JwtModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, AuthService],
})
export class ChatModule {}
