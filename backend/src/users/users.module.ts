import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chat/entities/chat.entity';
import { UsersController } from './users.controller';
import { User } from './Users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat])],
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