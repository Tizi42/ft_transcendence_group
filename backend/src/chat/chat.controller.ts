import { Controller, Get, Post, Body, Res, Param, Inject, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import RequestWithUser from 'src/users/utils/requestWithUser.interface';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { messageInfos } from './utils/types';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private userService: UsersService,
  ) {}

  @Post()
  saveMessage(@Body() body: messageInfos): Promise<Chat> {
    return this.chatService.saveMessage(body);
  }

  @Get()
  async chat(@Res() res: Response) {
    const boxes = await this.chatService.getMessages();
    return res.json(boxes);
  }

  @UseGuards(JwtAuthGuard)
  @Get('messages/:id')
  async chatWith(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Param('id') id: number
  ) : Promise<Chat[]> {
    return await this.chatService.getMessagesById(id, req.user.id);
  }

  @Get('dest')
  async dest(@Res() res: Response) {
    const dest = await this.chatService.getAllDest();
    return res.json(dest);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async lastMessages(@Req() req: RequestWithUser, @Param('id') id: number) {
    const messages = await this.chatService.getMessagesById(id, req.user.id);
    const last = messages[messages.length - 1];
    return last;
  }
}
