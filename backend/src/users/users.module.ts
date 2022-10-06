import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/channel/entities/channel.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, Channel]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [
    UsersService,
    TypeOrmModule.forFeature([User]),
  ],
})
export class UsersModule {
  // constructor(private usersService: UsersService) {
  //   this.usersService.removeAll();
  //   setTimeout(() => {
  //     this.usersService.createFakeUsers(10);
  //   }, 1000);
  // }
}