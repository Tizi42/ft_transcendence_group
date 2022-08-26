import { IsNotEmpty, IsString } from "class-validator";

export class UserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  
  @IsNotEmpty()
  @IsString()
  displayName: string;
}