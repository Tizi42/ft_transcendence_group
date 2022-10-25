import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Channel } from 'diagnostics_channel';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/users/utils/requestWithUser.interface';
import { ChannelService } from './channel.service';
import { ManageMemberDto } from './utils/manageMembers.dto';

@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getChannel(
    @Param('id') id: number
  ) {
    return await this.channelService.findChannelAndMembers(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllMyChannelsAndMembers(@Req() req: RequestWithUser): Promise<Channel[]> {
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

  @UseGuards(JwtAuthGuard)
  @Post('ignoreMember')
  async ignoreMemberPrivateChannel(
    @Body() manageMemberDto: ManageMemberDto,
    @Req() req: RequestWithUser
  ) {
    return await this.channelService.removeJoinRequest(req.user.id, manageMemberDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('acceptJoin')
  async acceptJoinPrivateChannel(
    @Body() manageMemberDto: ManageMemberDto,
    @Req() req: RequestWithUser
  ) {
    const channelName = await this.channelService.joinChannel(req.user, manageMemberDto.channelId);    
    return { channelName };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refuseJoin')
  async refuseJoinPrivateChannel(
    @Body() manageMemberDto: ManageMemberDto,
    @Req() req: RequestWithUser
  ) {
    const channelName = await this.channelService.refuseJoinChannel(req.user, manageMemberDto.channelId);    
    return { channelName };
  }

  @UseGuards(JwtAuthGuard)
  @Get('one/:id')
  async getOneWithoutMembers(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
  ) {
    return await this.channelService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll/privates')
  async getAllPrivatesChannels(@Req() req: RequestWithUser) {
    const privatesChannels = await this.channelService.findAllPrivatesChannels();
    let myPrivatesChannels = [];
    for (let i = 0; i < privatesChannels.length; i++) {
      for (let j = 0; j < req.user.memberPendingReqFrom.length; j++) {
        if (privatesChannels[i].id  === req.user.memberPendingReqFrom[j]) {
          myPrivatesChannels.push(privatesChannels[i]);
        }
      }
    }
    return myPrivatesChannels;
  }
}
