import { User } from "src/users/Users.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Messages } from "../messages/entities/messages.entity";

@Entity({ name: 'chat' })
export class ChatRoom {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    messages: Messages[];

    @Column()
    connectedUsers: User[];
}