import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { Battle } from './battle.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/Users.entity';
import { BattlesGateway } from './battles.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Battle, User]), UsersModule],
  providers: [BattlesService, BattlesGateway],
  controllers: [BattlesController],
  exports: [
    BattlesService,
    TypeOrmModule.forFeature([Battle]),
  ],
})
export class BattlesModule {}
