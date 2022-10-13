import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreatChannelDto } from './utils/createChannel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly userService: UsersService,
  ) {}

  async createChannel(channelDto: CreatChannelDto) {
    const newChannel = new Channel();

    newChannel.type = channelDto.type;
    newChannel.name = channelDto.name;
    newChannel.members = channelDto.members;
    newChannel.owner = channelDto.owner;
    newChannel.admins = channelDto.admins;
    if (channelDto.type === "protected") {
      newChannel.password = channelDto.password;
    } else {
      newChannel.password = null;
    }

    return await this.channelRepository.save(newChannel);
  }

  async findOne(id: number): Promise<Channel> {
    return await this.channelRepository.findOneBy({ id });
  }

  async leavingChannel(userId: number, channelId: number) {
    const user = await this.userService.findOneById(userId);
    const channel = await this.findOne(channelId);
    
    for (let i = 0; i < channel.members.length; i++)
    {
      if (channel.members[i] === user)
        channel.members.splice(i, 1);
    }
    for (let i = 0; i < channel.admins.length; i++)
    {
      if (channel.admins[i] === userId)
        channel.admins.splice(i, 1);
    }
    if (userId === channel.owner)
    {  
      if (channel.admins[channel.admins.length - 1] !== null)
        channel.owner = channel.admins[channel.admins.length - 1];
      else
        channel.owner = channel.members[channel.members.length - 1].id;
    }
  }

  async joinChannel(userId: number, channelId: number) {
    const user = await this.userService.findOneById(userId);
    const channel = await this.findOne(channelId);

    for (let i = 0; i < channel.banned.length; i++)
    {
      if (channel.banned[i] === userId)
        return console.log("unauthorized")
    }
    channel.members.push(user);
  }

  async isAdmin(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    for (let i = 0; i < channel.admins.length; i++)
    {
      if (channel.admins[i] === userId)
        return true;
    }
    return false;
  }

  async banUser(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);
    const user = await this.userService.findOneById(userId);
    channel.banned.push(userId);
  }

  async addAdmin(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);
    const user = await this.userService.findOneById(userId);

    channel.admins.push(userId);
  }

  async muteUser(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);
    const user = await this.userService.findOneById(userId);
    channel.muted.push(userId);
  }

  async unMute(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    for (let i = 0; i < channel.muted.length; i++)
    {
      if (channel.muted[i] === userId)
        channel.muted.splice(i, 1);
    }
  }

  async unBan(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    for (let i = 0; i < channel.banned.length; i++)
    {
      if (channel.banned[i] === userId)
        channel.banned.splice(i, 1);
    }
  }

}
