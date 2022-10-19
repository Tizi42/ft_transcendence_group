import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreatChannelDto } from './utils/createChannel.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly userService: UsersService,
  ) {}

  /* CREATE  */

  async createChannel(channelDto: CreatChannelDto) {
    const newChannel = new Channel();

    newChannel.type = channelDto.type;
    newChannel.name = channelDto.name;
    newChannel.members = channelDto.members;
    newChannel.owner = channelDto.owner;
    newChannel.admins = channelDto.admins;
    if (channelDto.type === "protected") {
      if (!channelDto.password) {
        throw new HttpException(
          'Bad Request, password is required', 
          HttpStatus.BAD_REQUEST
        );
      }
      const salt = await bcrypt.genSalt();
      newChannel.password = await bcrypt.hash(channelDto.password, salt);
    } else {
      newChannel.password = null;
    }

    return await this.channelRepository.save(newChannel);
  }

  /* FINDING  */

  async findOne(id: number) {
    return await this.channelRepository.find({
      relations: ['members'],
      where: {
        id: id,
      }
    });
  }

  async findChannelMembers(id: number): Promise<Channel[]> {
    return await this.channelRepository.find({
      relations: ['members'],
      where: {
        id: id,
      }
    });
  }

  async findAll(): Promise<Channel[]> {
    const channels = await this.channelRepository.find({
      relations: ['members'],
    });
    return channels;
  }

  async getAllMyChannels(id: number): Promise<Channel[]> {
    const channels = await this.channelRepository.find({
      relations: ['members'],
      where: [{
        members: {
              id: id,
          },
      }]
    });
    return channels;
  }

  /* CHECK IF EXIST */

  async isChannelMember(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    for (let i = 0; i < channel[0].members.length; i++)
    {
      if (channel[0].members[i].id === userId)
        return true;
    }
    return false;
  }

  async isMemberBan(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

      for (let i = 0; i < channel[0].banned.length; i++)
      {
        if (channel[0].banned[i] === userId)
          return true;
      }  
      return false;
  }

  async isAdmin(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    for (let i = 0; i < channel[0].admins.length; i++)
    {
      if (channel[0].admins[i] === userId)
        return true;
    }
    return false;
  }

  /* JOIN AND LEAVE */

  async leavingChannel(userId: number, channelId: number) {
    const user = await this.userService.findOneById(userId);
    const channel = await this.findOne(channelId);

    if (!this.isChannelMember(userId, channelId))
      return console.log("unauthorized");
    for (let i = 0; i < channel[0].members.length; i++)
    {
      if (channel[0].members[i].id === user.id)
        channel[0].members.splice(i, 1);
    }
    for (let i = 0; i < channel[0].admins.length; i++)
    {
      if (channel[0].admins[i] === userId)
        channel[0].admins.splice(i, 1);
    }
    if (userId === channel[0].owner)
    {  
      if (channel[0].admins[channel[0].admins.length - 1] !== null)
        channel[0].owner = channel[0].admins[channel[0].admins.length - 1];
      else
        channel[0].owner = channel[0].members[channel[0].members.length - 1].id;
    }
    this.channelRepository.save(channel);
  }

  async joinChannel(userId: number, channelId: number, password?: string) {
    const user = await this.userService.findOneById(userId);
    const channel = await this.findOne(channelId);

    if (this.isChannelMember(userId, channelId) || this.isMemberBan(userId, channelId))
    {
      console.log("unauthorized");
      return false;
    }
    if (channel[0].type === "protected")
    {
      if (channel[0].password !== password)
      {
        console.log("unauthorized");
        return false;
      }
    }
    for (let i = 0; i < channel[0].pendingReqFrom.length; i++)
    {
      if (channel[0].pendingReqFrom[i] === user.id)
        channel[0].pendingReqFrom.splice(i, 1);
    }
    channel[0].members.push(user);
    await this.channelRepository.save(channel);
    return true;
  }

  async refuseJoining(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    for (let i = 0; i < channel[0].pendingReqFrom.length; i++)
    {
      if (channel[0].pendingReqFrom[i] === userId)
        channel[0].pendingReqFrom.splice(i, 1);
    }
    this.channelRepository.save(channel);
    return true;
  }

  async joinRequest(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    if (this.isChannelMember(userId, channelId) || this.isMemberBan(userId, channelId))
    {
      console.log("unauthorized");
      return false;
    }
    channel[0].pendingReqFrom.push(userId);
    console.log("chann ?", channel[0]);
    this.channelRepository.save(channel);
    return true;
  }

  /* ADD, BAN AND MUTE */

  async addAdmin(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    if (!this.isChannelMember(userId, channelId) || this.isMemberBan(userId, channelId))
    {
      console.log("unauthorized");
      return false;
    }
    channel[0].admins.push(userId);
    this.channelRepository.save(channel);
  }

  async banUser(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    if (!this.isChannelMember(userId, channelId) || this.isMemberBan(userId, channelId))
    {
      console.log("unauthorized");
      return false;
    }  
    channel[0].banned.push(userId);
    this.channelRepository.save(channel);
  }  

  async muteUser(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    if (!this.isChannelMember(userId, channelId) || this.isMemberBan(userId, channelId))
      return console.log("unauthorized");
    channel[0].muted.push(userId);
    this.channelRepository.save(channel);
  }

  async unMute(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    if (!this.isChannelMember(userId, channelId) || this.isMemberBan(userId, channelId))
      return console.log("unauthorized");
    for (let i = 0; i < channel[0].muted.length; i++)
    {
      if (channel[0].muted[i] === userId)
        channel[0].muted.splice(i, 1);
    }
    this.channelRepository.save(channel);
  }

  async unBan(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    for (let i = 0; i < channel[0].banned.length; i++)
    {
      if (channel[0].banned[i] === userId)
        channel[0].banned.splice(i, 1);
    }
    this.channelRepository.save(channel);
  }
}
