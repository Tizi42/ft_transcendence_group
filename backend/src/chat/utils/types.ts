import { User } from "src/users/users.entity";

export type messageInfos = {
    // author: string;
    author: User;
    content: string;
    created_at: Date;
}