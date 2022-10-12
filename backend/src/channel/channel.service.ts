import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { UserDetails } from 'src/users/utils/types';
import { UserDto } from 'src/users/utils/user.dto';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { channelInfos } from './utils/types';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async createChannel(channel: channelInfos): Promise<Channel>{
    const newChannel = this.channelRepository.create(channel);
    await this.channelRepository.save(newChannel);

    return newChannel;
  }

  async findOne(id: number): Promise<Channel> {
    return await this.channelRepository.findOneBy({ id });
  }

  remove(id: any) {
    return `This action removes a #${id} channel`;
  }

  async leavingChannel(user: User): Promise<User> {
    this.channelRepository.remove(user.id);
  }
  // enlever un user + les droits si proprio / admin et les donner au premier 
  // si proprio : ajouter admin
  // admin = bannir ou mute d'autre utilisateur
}
