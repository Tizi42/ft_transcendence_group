import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatRoom } from './entities/chatRoom.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatRoom)
        private readonly chatRepository: Repository<ChatRoom>,
    ) {}

    async getRooms(): Promise<ChatRoom[]> {
        return await this.chatRepository.find();
    }
}