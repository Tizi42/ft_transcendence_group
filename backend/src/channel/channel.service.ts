import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { Socket } from 'socket.io';
import { UpdatePrivacyDto } from './utils/updatePrivacy.dto';
import { UpdatePasswordDto } from './utils/UpdatePassword.dto';
import { ManageMemberDto } from './utils/manageMembers.dto';
import { smallDataChannel } from './utils/smallDataChannel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly userService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async nameAlreadyExist(channelName: string) {
    const allChannels = await this.findAllChannelsAndMembers();

    if (
      channelName === "password_error" ||
      channelName === "ban_error" ||
      channelName === "channel_name_error"
    ) {
      return true;
    }
    for(let i = 0; i < allChannels.length; i++) {
      if (allChannels[i].name === channelName) {
        return true;
      }
    }
    return false;
  }

  async createChannel(channelDto: smallDataChannel) {
    const newChannel = new Channel();
    let user = await this.userService.findOne(channelDto.owner);

    if (user == null) return null;

    if (await this.nameAlreadyExist(channelDto.name)) {
      console.log("name already exist");
      return "channel_name_error";
    }
    newChannel.type = channelDto.type;
    if (channelDto.name.length < 3 || channelDto.name.length > 30) {
      return "channel_name_error";
    }
    newChannel.name = channelDto.name;
    newChannel.members = [user];
    newChannel.owner = channelDto.owner;
    newChannel.admins = [channelDto.owner];
    if (channelDto.type === "protected") {
      if (!channelDto.password || !this.validPassword(channelDto.password)) {
        return "password_error";
      }
      const salt = await bcrypt.genSalt();
      newChannel.password = await bcrypt.hash(channelDto.password, salt);
    } else {
      newChannel.password = null;
    }
    console.log(newChannel);
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

  async findAllChannelsAndMembersButPrivate(): Promise<Channel[]> {
    const allChannels = await this.channelRepository.find({
      relations: ["members"],
    });
    let allChannelsButPrivate = [];
    for (let i = 0; i < allChannels.length; i++) {
      if (allChannels[i].type != "private") {
        allChannelsButPrivate.push(allChannels[i]);
      }
    }
    return allChannelsButPrivate; 
  }

  async findChannelAndMembers(id: number): Promise<Channel[]> {
    return await this.channelRepository.find({
      relations: ['members'],
      where: {
        id: id,
      }
    });
  }

  async findAllPrivatesChannels(): Promise<Channel[]> {
    return await this.channelRepository.find({
      where: {
        type: "private",
      }
    });
  }

  async getAllMyChannels(id: number): Promise<Channel[]> {
    const channels = await this.channelRepository.find({
      relations: ['members'],
      where: [{
        members: {
              id: In([id]),
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
        const allUsers = await this.userService.findAll();
        let index = -1;
        for (let i = 0; i < allUsers.length; i++) {
          if ((index = allUsers[i].memberPendingReqFrom.indexOf(channel[0].id)) > -1) {
            allUsers[i].memberPendingReqFrom.splice(index, 1);
            await this.userRepository.save(allUsers[i]);
          }
        }
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
    if (!this.isChannelMember(userToMuteId, channel[0])) {
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
        return "password_error";
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
      return "password_error";
    }
    const salt = await bcrypt.genSalt();
    updatePasswordDto.channel.password = await bcrypt.hash(updatePasswordDto.password, salt);    
    return await this.channelRepository.save(updatePasswordDto.channel);
  }

  /* CHECK IF EXIST */

  isChannelMember(userId: number, channel: Channel) {
    for (let i = 0; i < channel.members.length; i++){
      if (channel.members[i].id === userId) {
        return true;
      }
    }
    return false;
  }

  isMemberBan(userId: number, channel: Channel) {
    for (let i = 0; i < channel.banned.length; i++) {
      if (channel.banned[i] === userId) {
        return true;
      }
    }  
    return false;
  }

  /* JOIN AND LEAVE */

  async joinChannel(user: User, channelId: number, password?: string) {
    const channel = await this.findChannelAndMembers(channelId);

    if (!channel) {
      return null;
    }
    if (this.isChannelMember(user.id, channel[0])) {
      console.log("error already member");
      return null;
    }
    if (this.isMemberBan(user.id, channel[0])) {
      return "ban_error";
    }

    if (channel[0].type === "protected") {
      if (!this.validPassword(password)) {
        return "password_error";
      }
      const match = await bcrypt.compare(password, channel[0].password);
      if (!match) {
        return "password_error";
      }
    }

    if (channel[0].type === "private") {
      let index = channel[0].memberPendingReqTo.indexOf(user.id);
      if (index == -1) {
        console.log("the channel did not invite this user");
        return null;
      }
      channel[0].memberPendingReqTo.splice(index, 1);

      index = user.memberPendingReqFrom.indexOf(channel[0].id);
      if (index == -1) {
        console.log("the channel did not invite this user");
        return null;
      }
      user.memberPendingReqFrom.splice(index, 1);
      await this.userRepository.save(user);
    }

    channel[0].members.push(user);
    await this.channelRepository.save(channel);
    
    return channel[0].name;
  }

  async sendJoinRequest(userId: number, manageMemberDto: ManageMemberDto) {
    const channel = await this.findChannelAndMembers(manageMemberDto.channelId);
    const target = await this.userRepository.findOneBy({ id: manageMemberDto.targetId });

    if (!channel || !target) {
      return null;
    }
    if (channel[0].owner != userId) {
      return null;
    }
    if (
      this.isChannelMember(target.id, channel[0]) ||
      this.isMemberBan(target.id, channel[0])
    ) {
      console.log("unauthorized");
      return null;
    }
    channel[0].memberPendingReqTo.push(target.id);
    target.memberPendingReqFrom.push(channel[0].id);

    await this.channelRepository.save(channel);
    await this.userRepository.save(target);
    
    return channel[0];
  }

  async removeJoinRequest(userId: number, manageMemberDto: ManageMemberDto) {
    const channel = await this.findChannelAndMembers(manageMemberDto.channelId);
    const target = await this.userRepository.findOneBy({ id: manageMemberDto.targetId });

    if (!channel || !target) {
      return null;
    }
    if (channel[0].owner != userId) {
      return null;
    }
    
    let index = channel[0].memberPendingReqTo.indexOf(target.id);
    if (index > -1) {
      channel[0].memberPendingReqTo.splice(index, 1);
    }

    index = target.memberPendingReqFrom.indexOf(channel[0].id);
    if (index > -1) {
      target.memberPendingReqFrom.splice(index, 1);
    }

    await this.channelRepository.save(channel[0]);
    await this.userRepository.save(target);
    
    return channel[0];
  }

  async refuseJoinChannel(target: User, channelId: number) {
    const channel = await this.findChannelAndMembers(channelId);

    if (!channel || !target) {
      return null;
    }
    
    let index = channel[0].memberPendingReqTo.indexOf(target.id);
    if (index > -1) {
      channel[0].memberPendingReqTo.splice(index, 1);
    }

    index = target.memberPendingReqFrom.indexOf(channel[0].id);
    if (index > -1) {
      target.memberPendingReqFrom.splice(index, 1);
    }

    await this.channelRepository.save(channel[0]);
    await this.userRepository.save(target);
    
    console.log("endding");
    return channel[0].name;
  }
}
