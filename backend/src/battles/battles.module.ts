import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { Battle } from './battle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Battle])],
  providers: [BattlesService],
  controllers: [BattlesController],
  exports: [
    BattlesService,
    TypeOrmModule.forFeature([Battle]),
],
})
export class BattlesModule {}
