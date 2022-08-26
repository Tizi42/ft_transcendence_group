import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    displayName: string;

    @Column()
    email: string;

    @Column()
    picture: string;

    @Column({ nullable: true })
    twoFactorAuthenticationSecret: string;
}