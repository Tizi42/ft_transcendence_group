import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class SetDisplayNameDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(16)
    displayname: string;
}