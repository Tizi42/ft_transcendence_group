import { IsNotEmpty } from "class-validator";

export class BattleShowDto {
  @IsNotEmpty()
  opponent1: string;

  @IsNotEmpty()
  picture1: string;
  
  @IsNotEmpty()
  opponent2: string;
  
  @IsNotEmpty()
  picture2: string;

  @IsNotEmpty()
  winner: number;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  time: string;
}
