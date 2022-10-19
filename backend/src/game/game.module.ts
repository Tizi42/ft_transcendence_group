import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatModule } from 'src/chat/chat.module';
import { ChannelModule } from 'src/channel/channel.module';
import { BattlesService } from 'src/battles/battles.service';

@Module({
  imports: [
    UsersModule,
    ChatModule,
    ChannelModule
  ],
  controllers: [GameController],
  providers: [
    GameService,
    GameGateway,
    BattlesService
],
})
export class GameModule {}
