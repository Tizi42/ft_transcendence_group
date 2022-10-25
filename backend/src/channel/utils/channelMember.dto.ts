import { IsNotEmpty, IsNumber } from "class-validator";

export class channelMember {
    @IsNotEmpty()
    @IsNumber()
    member: number;

    @IsNotEmpty()
    @IsNumber()
    id: number;
}