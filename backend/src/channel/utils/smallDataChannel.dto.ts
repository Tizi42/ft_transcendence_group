import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class smallDataChannel {
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
    @IsNumber()
    owner: number;

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}
