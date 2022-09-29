import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { User } from "../Users.entity";

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

  @IsString()
  pictureLocalFilename: string;
}