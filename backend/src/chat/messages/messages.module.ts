import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from './entities/messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Messages])],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
  exports: [
    MessagesService,
    TypeOrmModule.forFeature([Messages]),
],
})
export class MessagesModule {}
