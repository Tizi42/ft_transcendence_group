import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Channel } from "../entities/channel.entity";

export class UpdatePasswordDto {
    @IsNotEmpty()
    channel: Channel;

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}