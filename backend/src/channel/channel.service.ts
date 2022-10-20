import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreatChannelDto } from './utils/createChannel.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { Socket } from 'socket.io';
import { UpdatePrivacyDto } from './utils/updatePrivacy.dto';
import { UpdatePasswordDto } from './utils/UpdatePassword.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly userService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createChannel(channelDto: CreatChannelDto) {
    const newChannel = new Channel();

    newChannel.type = channelDto.type;
    newChannel.name = channelDto.name;
    newChannel.members = channelDto.members;
    newChannel.owner = channelDto.owner;
    newChannel.admins = channelDto.admins;
    if (channelDto.type === "protected") {
      if (!channelDto.password || !this.validPassword(channelDto.password)) {
        return null;
      }
      const salt = await bcrypt.genSalt();
      newChannel.password = await bcrypt.hash(channelDto.password, salt);
    } else {
      newChannel.password = null;
    }

    return await this.channelRepository.save(newChannel);
  }

  async findOne(id: number): Promise<Channel> {
    return await this.channelRepository.findOneBy({ id });
  }

  async findAllChannelsAndMembers(): Promise<Channel[]> {
    return await this.channelRepository.find({
      relations: ["members"],
    });
  }

  async findChannelAndMembers(id: number): Promise<Channel[]> {
    return await this.channelRepository.find({
      relations: ['members'],
      where: {
        id: id,
      }
    });
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

  async joinChannelsRooms(socket: Socket) {
    const channels = await this.getAllMyChannels(socket.data.id);

    for (let i = 0; i < channels.length; i++) {
      console.log(`id ${socket.data.id} joinning ${channels[i].name}`);
      socket.join(channels[i].name);
    }
  }

  async leavingChannel(channelId: number, userId: number) {
    const channel = await this.findChannelAndMembers(channelId);
    
    if (!channel) {
      return null;
    }

    for (let i = 0; i < channel[0].members.length; i++) {
      if (channel[0].members[i].id === userId) {
        channel[0].members.splice(i, 1);
      }
    }

    for (let i = 0; i < channel[0].admins.length; i++) {
      if (channel[0].admins[i] === userId) {
        channel[0].admins.splice(i, 1);
      }
    }

    if (channel[0].owner === userId) {
      if (channel[0].members.length === 0) {
        await this.channelRepository.remove(channel)
        return channel[0].name;
      } else if (channel[0].admins.length === 0) {
        channel[0].owner = channel[0].members[0].id;
        channel[0].admins[0] = channel[0].members[0].id;
      } else {
        channel[0].owner = channel[0].admins[0];
      }
    }

    await this.channelRepository.save(channel);
    return channel[0].name;
  }

  async makeAdmin(channelId: number, userId: number, newAdminId: number) {
    const channel = await this.findChannelAndMembers(channelId);

    if (!channel) {
      return null;
    }
    for (let i = 0; i < channel[0].admins.length; i++) {
      if (channel[0].admins[i] === newAdminId) {
        return null;
      }
    }
    if (channel[0].owner === userId) {
      for (let i = 0; i < channel[0].members.length; i++) {
        if (channel[0].members[i].id === newAdminId) {
          channel[0].admins.push(newAdminId);
          await this.channelRepository.save(channel);
          return channel[0].name;
        }
      }
    }
    return null;
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

  async banUser(channelId: number, userId: number, userToBanId: number) {
    const channel = await this.findChannelAndMembers(channelId);

    if (!channel || await this.isAdmin(userToBanId, channelId)) {
      return null;
    }
    for (let i = 0; i < channel[0].members.length; i++) {
      if (channel[0].members[i].id === userToBanId) {
        channel[0].banned.push(userToBanId);
        await this.channelRepository.save(channel);
        return channel[0].name;
      }
    }
    return null;
  }

  async muteUser(channelId: number, userToMuteId: number) {
    const channel = await this.findChannelAndMembers(channelId);

    if (!channel || await this.isAdmin(userToMuteId, channelId)) {
      return null;
    }
    for (let i = 0; i < channel[0].members.length; i++) {
      if (channel[0].members[i].id === userToMuteId) {
        for (let i =0; i < channel[0].muted.length; i++) {
          if (channel[0].muted[i] === userToMuteId) {
            return null;
          }
        }
        channel[0].muted.push(userToMuteId);
        await this.channelRepository.save(channel);
        return channel[0].name;
      }
    }
    return null;
  }

  async unMuteUser(channelId: number, userToMuteId: number) {
    const channel = await this.findChannelAndMembers(channelId);

    if (!channel) {
      return null;
    }
    for (let i = 0; i < channel[0].muted.length; i++)
    {
      if (channel[0].muted[i] === userToMuteId)
        channel[0].muted.splice(i, 1);
        await this.channelRepository.save(channel);
    }
  }

  validPassword(password: string) {
    if (password.length >= 8 && password.length <= 20) {
      return true;
    }
    return false;
  }

  async updateChannelPrivacy(updatePrivacyDto: UpdatePrivacyDto) {
    if (updatePrivacyDto.channel.type === updatePrivacyDto.type) {
      return null;
    }
    if (updatePrivacyDto.type === "protected") {
      if (!updatePrivacyDto.password || !this.validPassword(updatePrivacyDto.password)) {
        return null;
      }
      const salt = await bcrypt.genSalt();
      updatePrivacyDto.channel.password = await bcrypt.hash(updatePrivacyDto.password, salt);
    } else {
      updatePrivacyDto.channel.password = null;
    }
    updatePrivacyDto.channel.type = updatePrivacyDto.type;
    return await this.channelRepository.save(updatePrivacyDto.channel);
  }

  async updateChannelPassword(updatePasswordDto: UpdatePasswordDto) {
    if (updatePasswordDto.channel.type != "protected") {
      return null;
    }
    if (!updatePasswordDto.password || !this.validPassword(updatePasswordDto.password)) {
      return null;
    }
    const salt = await bcrypt.genSalt();
    updatePasswordDto.channel.password = await bcrypt.hash(updatePasswordDto.password, salt);    
    return await this.channelRepository.save(updatePasswordDto.channel);
  }

  /* CHECK IF EXIST */

  async isChannelMember(userId: number, channelId: number) {
    const channel = await this.findChannelAndMembers(channelId);

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

  /* JOIN AND LEAVE */

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
}
