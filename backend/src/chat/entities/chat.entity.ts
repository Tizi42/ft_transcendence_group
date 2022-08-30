import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

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
}