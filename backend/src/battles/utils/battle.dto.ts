import { IsNotEmpty } from "class-validator";

export class BattleDto {
  @IsNotEmpty()
  opponent1: number;
  
  @IsNotEmpty()
  opponent2: number;

  @IsNotEmpty()
  mode: string;
}