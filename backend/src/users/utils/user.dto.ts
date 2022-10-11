import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Channel } from "diagnostics_channel";

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

  @IsString()
  pictureLocalFilename: string;
}