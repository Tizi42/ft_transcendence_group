import { User } from "src/users/users.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";

@Entity({ name: 'channel' })
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "public" })
    type: string;

    @Column()
    name: string;

    @ManyToMany(() => User, (user) => user.channels)
    @JoinTable()
    members: User[];

    @Column()
    owner: number;

    @Column("int", { array: true, default: {} })
    admins: number[];

    @Column("int", { array: true, default: {} })
    banned: number[];

    @Column("int", { array: true, default: {} })
    muted: number[];

    @Column({ nullable: true })
    password: string;
    
    @Column("int", { array: true, default: {} })
    pendingReqTo: number[];
}
