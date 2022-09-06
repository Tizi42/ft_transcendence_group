import { Messages } from "src/chat/messages/entities/messages.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany( () => Messages, (Messages))
    messages?: Messages[];
}