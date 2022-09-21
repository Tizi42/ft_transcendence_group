import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { parse } from 'dotenv';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/Users.entity';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class ChatService {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
    ) {}

    /***Messages Managment***/

    async saveMessage(content: string, author: User) {
        const newMessage = this.messagesRepository.create({
            content,
            author,
        });
        await this.messagesRepository.save(newMessage);

        return newMessage;
    }

    async getAllMessages() {
        return await this.messagesRepository.find({
            relations: ['author'],
        });
    }

    /***Verify User***/

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
