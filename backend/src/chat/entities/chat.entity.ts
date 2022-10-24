import { User } from "../../users/users.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: 'chat' })
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne( () => User, (author: User) => author.messages )
    dest: User;

    @ManyToOne( () => User, (author: User) => author.messages )
    author: User;

    @Column( { default: -1 })
    channelId: number;
}