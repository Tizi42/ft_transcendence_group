import { Channel } from "../channel/entities/channel.entity";
import { Chat } from "../chat/entities/chat.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({default: ""})
  username: string;
  
  @Column({default: ""})
  displayName: string;
  
  @Column({default: "nobody@42.intra.fr"})
  email: string;

  @Column({default: "http://localhost:3000/api/users/avatar_default"})
  picture: string;

  @Column({default: ""})
  pictureLocalFilename: string;
  
  @Column({ nullable: true })
  twoFactorAuthenticationSecret: string;

  @Column({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @Column({ default: true })
  isFirstEnablingTwoFactor: boolean;

  @Column({ default: true })
  allowNotifications: boolean;
  
  @Column("int", { array: true, default: {} })
  friendWith: number[];

  @Column("int", { array: true, default: {} })
  friendPendingReqTo: number[];

  @Column("int", { array: true, default: {} })
  friendPendingReqFrom: number[];

  @Column("int", { array: true, default: {} })
  blocked: number[];

  @Column("int", { array: true, default: {} })
  blockedBy: number[];

  @Column({default: 0})
  totalGames: number;

  @Column({default: 0})
  totalVictories: number;

  @Column({default: 0})
  totalDraws: number;

  @Column({default: -1, nullable: true})
  winRate: number;
  
  @Column({ default: "offline" })
  status: string;

  @OneToMany(() => Chat, (messages: Chat) => messages.author)
  messages?: Chat[];

  @ManyToMany(() => Channel, (channel: Channel) => channel.members)
  channels: Channel[];

  @Column("int", { array: true, default: {} })
  memberPendingReqFrom: number[];
}

