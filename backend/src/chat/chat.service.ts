import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/users.entity';
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
        // console.log("SAVE");
        const newMessage = this.chatRepository.create(content);
        await this.chatRepository.save(newMessage);

        return newMessage;
    }

    async getMessages(): Promise<Chat[]> {
        console.log("GET MESSAGES");
        return await this.chatRepository.find({ relations: ['author'] });
    }

    async getAllDest(): Promise<Chat[]> {
        console.log("GET DESTS");
        return await this.chatRepository.find({ relations: ['dest'] });
    }

    async getMessagesById(destId: number, authorId: number): Promise<Chat[]>{
        const query = await this.chatRepository.find({
            relations: ['dest', 'author'],
            where: [{
                dest: {
                    id: destId,
                },
                author: {
                    id: authorId,
                }
            },
            {
                author: {
                    id: destId,
                },
                dest: {
                    id: authorId,
                }
            }],
        });
        console.log("query = ", query);
        return query;
    }

    async getUserFromSocket(socket: Socket) {
        const cookies = socket.handshake.headers.cookie;
        if (!cookies) {
            return null;
        }
        const cookieJwt = cookies
            .split('; ')
            .find((cookie: string) => cookie.startsWith('jwt'));
        
        if (!cookieJwt) {
            return null;
        }
        const tokenJwt = cookieJwt
            .split('=')[1];

        const user = await this.authService.getUserFromAuthenticationToken(tokenJwt);
        
        if (!user) {
            throw new WsException('Invalid Credentials !');
        }
        socket.data = user;

        return user;
    }
}
