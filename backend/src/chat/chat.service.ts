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
        const newMessage = await this.messagesRepository.create({
            content,
            author,
        });
        await this.messagesRepository.save(newMessage);

        return newMessage;
    }

    async getAllMessages() {
        return this.messagesRepository.find({
            relations: ['author'],
        });
    }

    /***Verify User***/

    async getUserFromSocket(socket: Socket) {
        const cookie = socket.handshake.headers.cookie;
        console.log("inside header = ", socket.handshake.headers);
        console.log("inside cookie = ", cookie);
        const { Authentication: authenticationToken } = parse(cookie);
        const user = await this.authService.getUserFromAuthenticationToken(authenticationToken);

        if (!user) {
            throw new WsException('Invalid Credentials !');
        }
        return user;
    }
}
