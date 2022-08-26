import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './Users.entity';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    exports: [
        UsersService,
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [UsersController]
})
export class UsersModule {}
