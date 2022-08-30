import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from './entities/chat.entity';
import { messageInfos } from './utils/types';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
    ) {}

    async saveMessage(content: messageInfos): Promise<Chat> {
        const newMessage = this.chatRepository.create(content);
        return await this.chatRepository.save(newMessage);
    }
    async getMessages(): Promise<Chat[]> {
        return await this.chatRepository.find();
    }
}