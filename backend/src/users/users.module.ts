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
  constructor(private usersService: UsersService) {
    if (this.usersService.needRecreate()) {
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