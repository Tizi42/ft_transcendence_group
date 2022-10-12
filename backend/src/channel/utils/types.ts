import { User } from "src/users/users.entity";
import { TypeOfChan } from "../entities/channel.entity";

export type channelInfos = {
    type: TypeOfChan;
    members: User[];
    owner?: User;
    admin?: User[];
    banned?: User[];
    muted?: User[];
    password?: string;
}