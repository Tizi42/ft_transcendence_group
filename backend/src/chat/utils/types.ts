import { User } from "src/users/users.entity";

export type messageInfos = {
    author: User;
    content: string;
    created_at: Date;
}