import { User } from "../../users/users.entity";

export type messageInfos = {
    content: string;
    authorId: number;
    destId: number;
}

export type emojiInfo = {
    author: string;
    dest: string;
    content: number;
}

export type ChannelMessage = {
    content: string;
    authorId: number;
    channelId: number;
}

export type messageInGame = {
    author: string;
    dest: string;
    content: string;
}
