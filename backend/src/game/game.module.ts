import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    UsersModule,
    ChatModule,
  ],
  controllers: [GameController],
  providers: [
    GameService,
    GameGateway,
],
})
export class GameModule {}
