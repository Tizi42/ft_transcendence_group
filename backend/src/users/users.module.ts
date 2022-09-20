import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/chat/message.entity';
import { UsersController } from './users.controller';
import { User } from './Users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Message])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [
    UsersService,
    TypeOrmModule.forFeature([User]),
  ],
})
export class UsersModule {
  constructor(private usersService: UsersService) {
    this.usersService.removeAll();
    this.usersService.createFakeUsers(10);
  }
}
