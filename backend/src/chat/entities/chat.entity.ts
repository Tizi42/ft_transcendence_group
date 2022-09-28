import { User } from "src/users/Users.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: 'chat' })
export class Chat {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne( () => User, (author) => author.messages )
    dest: User;

    @ManyToOne( () => User, (author) => author.messages )
    author: User;
}