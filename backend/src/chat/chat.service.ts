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
        console.log("LA");
        const newMessage = this.chatRepository.create(content);
        return await this.chatRepository.save(newMessage);
    }
    async getMessages(): Promise<Chat[]> {
        console.log("ICI");
        return await this.chatRepository.find();
    }
    async getMessagesById(id: any): Promise<Chat> {
        const chat = await this.chatRepository.findOne({
            where: { id: id }, 
            relations: ['author'],
        });
        return chat;
    }
}