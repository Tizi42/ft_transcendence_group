import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatRoom } from '../entities/chatRoom.entity';
import { Messages } from './entities/messages.entity';
import { messageInfos } from './utils/types';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Messages)
        private readonly messagesRepository: Repository<Messages>,
    ) {}

    async saveMessage(content: messageInfos): Promise<Messages> {
        const newMessage = this.messagesRepository.create(content);
        return await this.messagesRepository.save(newMessage);
    }

    async getMessages(): Promise<Messages[]> {
        return await this.messagesRepository.find();
    }
}