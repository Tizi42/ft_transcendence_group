import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { User } from "../users.entity";

export class UserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  
  @IsNotEmpty()
  @IsString()
  displayName: string;
  
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  picture: string;

  dest: User;
}