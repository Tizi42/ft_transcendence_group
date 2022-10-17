import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreatChannelDto } from './utils/createChannel.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { Socket } from 'socket.io';

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

  async findOne(id: number): Promise<Channel> {
    return await this.channelRepository.findOneBy({ id });
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

  async leavingChannel(channelId: number, userId: number, socket: Socket) {
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
