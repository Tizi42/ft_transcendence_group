import { User } from "src/users/Users.entity";
import { ChatRoom } from "../../entities/chatRoom.entity";

export type messageInfos = {
    message: string;
    owner: User;
    room: ChatRoom;
    created_at: Date;
}