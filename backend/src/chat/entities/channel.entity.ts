import { User } from "src/users/users.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";

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
  
    @ManyToOne( () => User, (author) => author.messages )
    receiver: User[];

    @Column()
    owner: User;

    @Column()
    admin: User[];

    @Column()
    password: string;
}
