import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'battles' })
export class Battle {
    
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    date_start: Date;
  
    @Column()
    opponent1: number;
  
    @Column()
    opponent2: number;
  
    @Column({ default: undefined, nullable: true })
    winner: number;
  
    @Column({ default: false })
    isFinished: boolean;
}