import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoom } from './entities/chatRoom.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async ChatRoom(@Res() res) {
    const rooms = await this.chatService.getRooms();
    return res.json(rooms);
  }
}
