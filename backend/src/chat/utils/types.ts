import { User } from "src/users/users.entity";

export type messageInfos = {
    author: User;
    dest: User;
    content: string;
    channelId?: number;
}

export type emojiInfo = {
    author: string;
    dest: string;
    content: number;
}
