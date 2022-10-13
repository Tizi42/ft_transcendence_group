import { User } from "src/users/users.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Any } from "typeorm";

export type TypeOfChan = "private" | "public" | "protected"

@Entity({ name: 'channel' })
export class Channel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: ["private", "public", "protected"],
        default: "public", 
    })
    type: TypeOfChan;

    @ManyToOne(() => User, (user) => user.channels)
    members: User[];

    @Column({ nullable: true })
    owner: number;

    @Column("int", { array: true, nullable: true })
    admins: number[];

    @Column("int", { array: true, nullable: true })
    banned: number[];

    @Column("int", { array: true, nullable: true })
    muted: number[];

    @Column({ nullable: true })
    password: string;
}
