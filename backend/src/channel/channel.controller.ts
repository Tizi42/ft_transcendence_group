import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/users/utils/requestWithUser.interface';
import { ChannelService } from './channel.service';
import { channelMember } from './utils/channelMember.dto';
import { CreatChannelDto } from './utils/createChannel.dto';
import { UpdatePrivacyDto } from './utils/updatePrivacy.dto';

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
  @Get()
  async getAllChannelsAndMembers(@Req() req: RequestWithUser) {
    return this.channelService.findAllChannelsAndMembers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('isMember/:id')
  getIfMember(
    @Req() req: RequestWithUser,
    @Param('id') id: number
  ) {
    console.log("chan =", id, "member =", req.user.id);
    return this.channelService.isChannelMember(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('members/:id')
  async getChannelMembers(
    @Param('id') id: number
  ) {
    return await this.channelService.findChannelAndMembers(id);
  }
}
