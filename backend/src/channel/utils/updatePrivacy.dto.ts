import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Channel } from "../entities/channel.entity";

export class UpdatePrivacyDto {
    @IsNotEmpty()
    channel: Channel;
    
    @IsNotEmpty()
    @IsString()
    @IsIn(["public", "private", "protected"])
    type: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}