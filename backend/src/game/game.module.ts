import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';

@Module({
  controllers: [GameController],
  providers: [
    GameService,
    //GameGateway,
  ]
})
export class GameModule {}
