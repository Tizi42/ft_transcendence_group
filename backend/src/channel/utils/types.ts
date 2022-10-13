import { User } from "src/users/users.entity";
import { TypeOfChan } from "../entities/channel.entity";

export type channelInfos = {
    type: TypeOfChan;
    members: User[];
    owner: number;
    admin: number[];
    banned?: number[];
    muted?: number[];
    password?: string;
}