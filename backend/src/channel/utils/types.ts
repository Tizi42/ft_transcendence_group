import { User } from "src/users/users.entity";
import { TypeOfChan } from "../entities/channel.entity";

export type channelInfos = {
    type: TypeOfChan;
    receiver: User[];
    owner?: User;
    admin?: User[];
    password?: string;
}