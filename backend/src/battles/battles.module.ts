import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { Battle } from './battle.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from "src/users/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Battle, User]), UsersModule],
  providers: [BattlesService],
  controllers: [BattlesController],
  exports: [
    BattlesService,
    TypeOrmModule.forFeature([Battle]),
  ],
})
export class BattlesModule {
  constructor(private readonly battlesService: BattlesService) {
    if (false) {
      this.battlesService.removeAll();
      setTimeout(() => {
        console.log("create fake battles");
        this.battlesService.createFakeBattles(20, 9);
      }, 20000);
    }
  }
}
