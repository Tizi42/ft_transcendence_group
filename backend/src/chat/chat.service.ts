import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from "typeorm";
import { Chat } from './entities/chat.entity';
import { messageInfos } from './utils/types';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        private readonly authService: AuthService,
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
        return await this.chatRepository.find({ relations: ['dest'], take: 3 });
    }
    async getMessagesById(id: number): Promise<Chat[]>{
        const query = await this.chatRepository.createQueryBuilder()
        .select("*")
        .where('"destId" = :id', { id: id })
        .orWhere('"authorId" = :id', { id: id })
        .getRawMany();
        // console.log(query);
        return query;
    }
    async getUserFromSocket(socket: Socket) {
        const cookieJwt = socket.handshake.headers.cookie
        .split('; ')
        .find((cookie: string) => cookie.startsWith('jwt'))
        .split('=')[1];
    const user = await this.authService.getUserFromAuthenticationToken(cookieJwt);

    if (!user) {
        throw new WsException('Invalid Credentials !');
    }
    socket.data = user;
    return user;
    }
}