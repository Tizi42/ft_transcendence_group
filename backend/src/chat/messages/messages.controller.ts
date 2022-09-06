import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { messageInfos } from './utils/types';

@Controller('chat/message')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // @Post()
  // saveMessage(@Body() body: messageInfos): Promise<ChatRoom> {
  //   return this.messagesService.saveMessage(body);
  // }

  @Get()
  async getMessages(@Res() res) {
    const messages = await this.messagesService.getMessages();
    return res.json(messages);
  }
}