import { Chat } from "src/chat/entities/chat.entity";

export type UserDetails = {
    username: string;
    displayName: string;
    email: string;
    picture: string;
    messages?: Chat[];
};