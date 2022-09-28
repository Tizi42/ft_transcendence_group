import { User } from "src/users/Users.entity";

export type messageInfos = {
    // author: string;
    author: User;
    content: string;
    created_at: Date;
}