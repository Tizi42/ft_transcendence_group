import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'chat' })
export class Chat {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    author: string;

    @Column()
    content: string;
}