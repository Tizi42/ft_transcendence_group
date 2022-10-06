import { User } from "src/users/users.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

export type TypeOfChan = "private" | "public" | "protected" | "toOne"

@Entity({ name: 'channel' })
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: ["private", "public", "protected", "toOne"],
        default: "toOne"
    })
    type: TypeOfChan;

    @ManyToOne(() => User, (user) => user.channels)
    members: User[];

    @Column({ nullable: true })
    owner: User;

    @Column({ nullable: true })
    admin: User[];

    @Column({ nullable: true })
    password: string;
}
