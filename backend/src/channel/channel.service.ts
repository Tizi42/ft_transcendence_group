import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreatChannelDto } from './utils/createChannel.dto';
// import * as bcrypt from 'bcrypt';

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
      if (!channelDto.password) {
        throw new HttpException(
          'Bad Request, password is required', 
          HttpStatus.BAD_REQUEST
        );
      }
      // const salt = await bcrypt.genSalt();
      // newChannel.password = await bcrypt.hash(channelDto.password, salt);
      newChannel.password = channelDto.password;
    } else {
      newChannel.password = null;
    }

    return await this.channelRepository.save(newChannel);
  }

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

  async leavingChannel(userId: number, channelId: number) {
    const user = await this.userService.findOneById(userId);
    const channel = await this.findOne(channelId);
    
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
  }

  async joinChannel(userId: number, channelId: number) {
    const user = await this.userService.findOneById(userId);
    const channel = await this.findOne(channelId);

    for (let i = 0; i < channel[0].banned.length; i++)
    {
      if (channel[0].banned[i] === userId)
        return console.log("unauthorized")
    }
    for (let i = 0; i < channel[0].members.length; i++)
    {
      if (channel[0].members[i].id === user.id)
        return console.log("unauthorized")
    }
    console.log("channel =", channel[0]);
    console.log("channel mem =", channel[0].members[0]);
    console.log("JOIN members", channel[0].members);
    channel[0].members.push(user);
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

  async banUser(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);
    const user = await this.userService.findOneById(userId);
    channel[0].banned.push(userId);
  }

  async addAdmin(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);
    const user = await this.userService.findOneById(userId);

    channel[0].admins.push(userId);
  }

  async muteUser(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);
    const user = await this.userService.findOneById(userId);
    channel[0].muted.push(userId);
  }

  async unMute(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    for (let i = 0; i < channel[0].muted.length; i++)
    {
      if (channel[0].muted[i] === userId)
        channel[0].muted.splice(i, 1);
    }
  }

  async unBan(userId: number, channelId: number) {
    const channel = await this.findOne(channelId);

    for (let i = 0; i < channel[0].banned.length; i++)
    {
      if (channel[0].banned[i] === userId)
        channel[0].banned.splice(i, 1);
    }
  }

}
