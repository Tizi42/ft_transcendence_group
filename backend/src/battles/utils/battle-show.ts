import { IsNotEmpty } from "class-validator";

export class BattleShow {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  opponent1: number;

  @IsNotEmpty()
  name1: string;

  @IsNotEmpty()
  picture1: string;

  @IsNotEmpty()
  score1: number;
  
  @IsNotEmpty()
  opponent2: number;

  @IsNotEmpty()
  name2: string;
  
  @IsNotEmpty()
  picture2: string;

  @IsNotEmpty()
  score2: number;

  @IsNotEmpty()
  winner: number;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  isFinished: boolean;
}
