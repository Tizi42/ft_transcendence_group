import { User } from "src/users/users.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";

@Entity({ name: 'chat' })
export class Chat {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    author: string;

    @Column()
    content: string;

    @CreateDateColumn()
    created_at: Date;

    // @ManyToOne( () => User, (author) => author.messages )
    // author: User;
}