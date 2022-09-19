import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from 'src/users/users.entity';
import { createQueryBuilder, DataSource, Repository } from "typeorm";
import { Chat } from './entities/chat.entity';
import { messageInfos } from './utils/types';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async saveMessage(content: messageInfos): Promise<Chat> {
        console.log("SAVE");
        const newMessage = this.chatRepository.create(content);
        return await this.chatRepository.save(newMessage);
    }
    async getMessages(): Promise<Chat[]> {
        console.log("GET MESSAGES");
        return await this.chatRepository.find({ relations: ['author'] });
    }
    async getAllDest(): Promise<Chat[]> {
        console.log("GET DESTS");
        return await this.chatRepository.find({ relations: ['dest'] });
    }
    async getMessagesById(id: number): Promise<Chat[]>{
        const query = await this.chatRepository.createQueryBuilder()
        .select("*")
        .where('"destId" = :id', { id: id })
        .orWhere('"authorId" = :id', { id: id })
        .getRawMany();
        console.log(query);
        return query;
    }
}