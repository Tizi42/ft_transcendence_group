import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Battle } from "./battle.entity";
import { BattlesService } from "./battles.service";
import { BattleShow } from "./utils/battle-show";
import { BattleDto } from "./utils/battle.dto";

@Controller('/battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}
  
  @Get()
  getAll(): Promise<Battle[]>  {
    return this.battlesService.findAll();
  };
  
  @Post('/add')
  create(@Body() game: BattleDto) {
    return this.battlesService.addOne(game);
  }

  @Get("/show")
  async showAll(): Promise<BattleShow[]> {
    return await this.battlesService.showAll();
  }

  @Get('/show/:id')
  async getAllFor(@Param('id') id: number) : Promise<BattleShow[]> {
    return await this.battlesService.showAll(id);
  }
}
