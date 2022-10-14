import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { User } from "src/users/users.entity";

export class CreatChannelDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(["public", "private", "protected"])
    type: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    name: string;

    @IsNotEmpty()
    members: User[];

    @IsNotEmpty()
    @IsNumber()
    owner: number;

    @IsNotEmpty()
    @IsArray()
    admins: number[];

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}