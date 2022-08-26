import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  username: string;
  
  @Column()
  displayName: string;
  
  @Column({default: "nobody@42.intra.fr"})
  email: string;

  @Column({default: ""})
  picture: string;

  @Column("int", { array: true, default: {} })
  friendWith: number[];

  @Column("int", { array: true, default: {} })
  friendOf: number[];
}
