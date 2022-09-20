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

  @Column({default: -1, nullable: true})
  winRate: number;
}
