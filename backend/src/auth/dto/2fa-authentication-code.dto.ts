import { IsDecimal, IsInt, IsNotEmpty, Length } from "class-validator";

export class TwoFactorAuthenticationCodeDto {

    @IsNotEmpty()
    @Length(6, 6)
    @IsDecimal()
    authenticationCode: string;
}