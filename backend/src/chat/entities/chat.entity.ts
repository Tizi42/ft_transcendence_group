import { User } from "src/users/users.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity({ name: 'chat' })
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne( () => User, (author) => author.messages )
    dest: User;

    @ManyToOne( () => User, (author) => author.messages )
    author: User;

    @Column( { default: -1 })
    channelId: number;
}