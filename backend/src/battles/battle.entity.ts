import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'battles' })
export class Battle {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: number; // -> change to Date() 
  
    @Column()
    opponent1: number;
  
    @Column()
    opponent2: number;
  
    @Column()
    winner: number;
  
    @Column({ default: false })
    isFinished: boolean;
}