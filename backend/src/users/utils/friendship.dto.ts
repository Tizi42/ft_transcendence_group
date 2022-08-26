import { IsNotEmpty } from "class-validator";

export class FriendshipDto {
    @IsNotEmpty()
    id1: number;

    @IsNotEmpty()
    id2: number;
}