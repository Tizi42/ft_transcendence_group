import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class SetDisplayNameDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(16)
    displayname: string;
}