import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { messageInfos } from './utils/types';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  saveMessage(@Body() body: messageInfos): Promise<Chat> {
  console.log("[SAVE]" + body.author);
    return this.chatService.saveMessage(body);
  }

  @Get()
  async chat(@Res() res) {
    const boxes = await this.chatService.getMessages();
    return res.json(boxes);
  }

  @Get('messages/:id')
  async chatWith(@Res() res, @Param('id') id) {
    const boxes = await this.chatService.getMessagesById(id);
    console.log("hi there = ", boxes);
    return res.json(boxes);
  }
  @Get('dest')
  async dest(@Res() res) {
    const dest = await this.chatService.getAllDest();
    return res.json(dest);
  }
  @Get(':id')
  async lastMessages(@Param('id') id) {
    const messages = await this.chatService.getMessagesById(id);
    const last = messages[messages.length - 1];
    console.log("LAST =");
    console.log(last);
    return last;
  }
}
