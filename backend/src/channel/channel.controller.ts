import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/users/utils/requestWithUser.interface';
import { ChannelService } from './channel.service';
import { channelMember } from './utils/channelMember.dto';
import { CreatChannelDto } from './utils/createChannel.dto';
import { ManageMemberDto } from './utils/manageMembers.dto';
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
  async getChannel(
    @Param('id') id: number
  ) {
    return await this.channelService.findChannelAndMembers(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllMyChannelsAndMembers(@Req() req: RequestWithUser) {
    const allChannels = await this.channelService.findAllChannelsAndMembers();
    let myChannels = [];
    for (let i = 0; i < allChannels.length; i++) {
      for (let j = 0; j < allChannels[i].members.length; j++) {
        if (allChannels[i].members[j].id === req.user.id) {
          myChannels.push(allChannels[i]);
        }
      }
    }
    return myChannels;
  }

  @UseGuards(JwtAuthGuard)
  @Get('members/:id')
  async getChannelMembers(
    @Param('id') id: number
  ) {
    return await this.channelService.findChannelAndMembers(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addMember')
  async addMemberPrivateChannel(
    @Body() manageMemberDto: ManageMemberDto,
    @Req() req: RequestWithUser
  ) {
    return await this.channelService.sendJoinRequest(req.user.id, manageMemberDto);
  }
}
