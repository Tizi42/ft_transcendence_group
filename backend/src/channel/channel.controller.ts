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

  @Get(':id')
  async channel(@Param('id') id: number) {
    return this.channelService.findOne(id);
  }
}
