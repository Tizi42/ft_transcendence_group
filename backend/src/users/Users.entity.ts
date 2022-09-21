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

  @Column({default: ""})
  picture42URL: string;

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
  friendOf: number[];

  @Column("int", { array: true, default: {} })
  blocked: number[];

  @Column("int", { array: true, default: {} })
  blockedBy: number[];

  @Column({ default: false })
  online: boolean;
}
