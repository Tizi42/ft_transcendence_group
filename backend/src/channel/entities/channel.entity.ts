import { User } from "src/users/users.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Any, ManyToMany, JoinTable, OneToMany, RelationId } from "typeorm";

export type TypeOfChan = "private" | "public" | "protected"

@Entity({ name: 'channel' })
export class Channel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: ["private", "public", "protected"],
        default: "public", 
    })
    type: TypeOfChan;

    @ManyToMany(() => User, (user) => user.channels)
    @JoinTable()
    members: User[];
    // @RelationId((user: User) => user.channels)
    // memberIds: number[];

    @Column()
    owner: number;

    @Column("int", { array: true })
    admins: number[];

    @Column("int", { array: true, default: {} })
    banned: number[];

    @Column("int", { array: true, default: {} })
    muted: number[];

    @Column({ default: {} })
    password: string;
}
