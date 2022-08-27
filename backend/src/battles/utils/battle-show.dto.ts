import { IsNotEmpty } from "class-validator";

export class BattleShowDto {
  @IsNotEmpty()
  opponent1: string;
  
  @IsNotEmpty()
  opponent2: string;

  @IsNotEmpty()
  winner: string;

  @IsNotEmpty()
  date: string;
}
