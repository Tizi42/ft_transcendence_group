import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { channelInfos } from './utils/types';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  createChannel(@Body() createChannel: channelInfos) {
    // return this.channelService.createChannel(createChannel);
  }

  @Get(':id')
  async channel(@Param('id') id: number) {
    return this.channelService.findOne(id);
  }
}
