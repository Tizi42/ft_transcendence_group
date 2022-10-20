import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/users.entity';
import { Repository } from "typeorm";
import { Chat } from './entities/chat.entity';
import { ChannelMessage, messageInfos } from './utils/types';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        private readonly authService: AuthService,
    ) {}

    async saveMessage(content: messageInfos): Promise<Chat> {
        const newMessage = this.chatRepository.create(content);
        await this.chatRepository.save(newMessage);

        return newMessage;
    }

    async saveChannelMessage(data: ChannelMessage, author: User): Promise<Chat> {
        const newMessage = new Chat();

        newMessage.content = data.content;
        newMessage.dest = null;
        newMessage.author = author;
        newMessage.channelId = data.channelId;

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
        return query;
    }

    async getChannelMessagesById(channelId: number, authorId: number, blockedByAuthor: number[]): Promise<Chat[]> {
        const query = await this.chatRepository.find({
            relations: ['author'],
            where: {
                channelId: channelId,
            },
            order: {
                id: "ASC",
            }
        });
        console.log("query = ", query);
        for (let i = 0; i < query.length; i++) {
            for (let j = 0; j < blockedByAuthor.length; j++) {
                if (query[i].author.id === blockedByAuthor[j]) {
                    query[i].content = "🚫 blocked by you 🚫";
                }
            }
        }
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
            // throw new WsException('Invalid Credentials !');
            console.log("Invalid Credentials !");
            return null;
        }
        socket.data = user;

        return user;
    }
}
