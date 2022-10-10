import { Chat } from "../../chat/entities/chat.entity";

export type UserDetails = {
    username: string;
    displayName: string;
    email: string;
    picture: string;
    messages?: Chat[];
};

export type FriendShip = {
    from: string;
    to: string;
}
