import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { messageInfos } from './utils/types';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  saveMessage(@Body() body: messageInfos): Promise<Chat> {
    return this.chatService.saveMessage(body);
  }

  @Get()
  async Chat(@Res() res) {
    const messages = await this.chatService.getMessages();
    return res.json(messages);
  }
}
