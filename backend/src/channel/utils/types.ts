import { User } from "src/users/users.entity";
import { TypeOfChan } from "../entities/channel.entity";

export type channelInfos = {
    type: TypeOfChan;
    name: string;
    members: User[];
    owner: number;
    admins: number[];
    banned?: number[];
    muted?: number[];
    password?: string;
}