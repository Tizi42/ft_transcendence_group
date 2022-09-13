import { Chat } from "src/chat/entities/chat.entity";
import { Column, Entity,  OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    displayName: string;

    @Column()
    email: string;

    @Column()
    picture: string;

    @Column('bool', { nullable : true })
    isConnected: boolean;

    @OneToMany( () => Chat, (messages) => messages.author )
    messages?: Chat[];
}