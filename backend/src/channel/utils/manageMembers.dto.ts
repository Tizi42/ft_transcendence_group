import { IsNotEmpty, IsNumber } from "class-validator";


export class ManageMemberDto {
    @IsNotEmpty()
    @IsNumber()
    channelId: number;

    @IsNotEmpty()
    @IsNumber()
    targetId: number;
}