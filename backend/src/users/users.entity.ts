import { Chat } from "src/chat/entities/chat.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
  
  @Column({ nullable: true })
  twoFactorAuthenticationSecret: string;

  @Column({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @Column({ default: true })
  isFirstEnablingTwoFactor: boolean;
  
  @Column("int", { array: true, default: {} })
  friendWith: number[];

  @Column("int", { array: true, default: {} })
  friendOf: number[];

  @Column("int", { array: true, default: {} })
  blocked: number[];

  @Column("int", { array: true, default: {} })
  blockedBy: number[];

  @Column('bool', { nullable : true })
  isConnected: boolean;

  @OneToMany( () => Chat, (messages) => messages.author )
  messages?: Chat[];

}
