import { User } from "src/users/Users.entity";
import { ChatRoom } from "../entities/chatRoom.entity";
import { Messages } from "../messages/entities/messages.entity";

export type roomInfos = {
    name: string;
    messages: Messages[];
    connectedUsers: User[];
}