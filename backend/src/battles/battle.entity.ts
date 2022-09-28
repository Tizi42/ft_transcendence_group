import { User } from "src/users/Users.entity";
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

    @Column({ default: 0 })
    score1: number;

    @Column({ default: 0 })
    score2: number;
  
    @Column({ default: undefined, nullable: true })
    winner: number;
  
    @Column({ default: false })
    isFinished: boolean;
}
