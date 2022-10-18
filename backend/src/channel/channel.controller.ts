import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/users/utils/requestWithUser.interface';
import { ChannelService } from './channel.service';
import { channelMember } from './utils/channelMember.dto';
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

  @Get('/isMember')
  getIfMember(
    @Query('channel') channel: number,
    @Query('user') userId: number
  ) {
    console.log("chan =", channel, "member =", userId);
    return this.channelService.isChannelMember(userId, channel);
  }


  @UseGuards(JwtAuthGuard)
  @Get('members/:id')
  async getChannelMembers(
    @Param('id') id: number
  ) {
    return await this.channelService.findChannelMembers(id);
  }
}
