import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/users/utils/requestWithUser.interface';
import { ChannelService } from './channel.service';
import { CreatChannelDto } from './utils/createChannel.dto';

@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createChannel(
    @Req() req: RequestWithUser,
    @Body() createChannelDto: CreatChannelDto
  ) {
    return await this.channelService.createChannel(createChannelDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getChannel(
    @Param('id') id: number
  ) {
    return this.channelService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('members/:id')
  async getChannelMembers(
    @Param('id') id: number
  ) {
    return await this.channelService.findChannelAndMembers(id);
  }
}
