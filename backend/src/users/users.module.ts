import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chat/entities/chat.entity';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';
// import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chat]),
    // HttpModule,
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