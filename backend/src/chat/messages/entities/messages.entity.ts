import { User } from "src/users/Users.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { ChatRoom } from '../../entities/chatRoom.entity';

@Entity({ name: 'messages' })
export class Messages {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    owner: User;

    @CreateDateColumn()
    created_at: Date;
}