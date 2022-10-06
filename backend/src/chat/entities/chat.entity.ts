import { Channel } from "src/channel/entities/channel.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";

@Entity({ name: 'chat' })
export class Chat {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne( () => Channel, (channel) => channel.id ) 
    @JoinColumn()
    channel: Channel;

    @ManyToOne( () => User, (author) => author.messages )
    author: User;
}