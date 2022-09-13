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
        console.log("GET");
        return await this.chatRepository.find({ relations: ['author'] });
    }
    async getAllDest(): Promise<Chat[]> {
        console.log("GET DEST");
        return await this.chatRepository.find({ relations: ['dest'] });
    }
    async getMessagesById(dest: number) {
        // const destId = await this.userRepository.findOne(id);
        // console.log("=> " + destId.id);
        // const chat = await this.chatRepository.find({
        //     where: { dest: destId },
        //     skip: 0,
        //     take: 1,
        // });
        // const query = await this.chatRepository.createQueryBuilder()
        // .select("*")
        // .from(Chat, "chat")
        // .where("'destId' = :id", { id: dest })
        // .getMany()
        const query = await this.chatRepository.query('SELECT * FROM chat WHERE "destId" =' + dest);

        console.log("=> " + query);
    }
}