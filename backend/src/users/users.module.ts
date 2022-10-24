import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Battle } from 'src/battles/battle.entity';
import { BattlesService } from 'src/battles/battles.service';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from 'src/channel/entities/channel.entity';
import { ChatService } from 'src/chat/chat.service';
import { Chat } from 'src/chat/entities/chat.entity';
import { UserGateway } from './user.gateway';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chat, Channel, Battle]),
    JwtModule,
  ],
  providers: [
    UserGateway,
    UsersService,
    ChatService,
    AuthService,
    ChannelService,
    BattlesService,
  ],
  controllers: [
    UsersController,
  ],
  exports: [
    UsersService,
    TypeOrmModule.forFeature([User]),
  ],
})

export class UsersModule {
  constructor(private usersService: UsersService) {
    if (true) {
      console.log("creating 10 fake users");
      this.usersService.removeAll();
      setTimeout(() => {
      this.usersService.createFakeUsers(10);
      }, 1000);
    } else {
      console.log("don't create fake users");
    }
  }
}