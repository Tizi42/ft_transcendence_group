import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Battle } from "./battle.entity";
import { BattlesService } from "./battles.service";
import { BattleDto } from "./utils/battle.dto";

@Controller('/battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService,
    private readonly datasource: DataSource) {}
  
  @Get()
  getAll(): Promise<Battle[]>  {
    return this.battlesService.findAll();
  };

  @Post('/add')
  create(@Body() game: BattleDto) {
    return this.battlesService.addOne(game);
  }

  @Get(':id')
  getAllFor(@Param('id') id: number) : Promise<Battle[]> {
    let battles = this.battlesService.findAllFor(id);
    return (battles);
  }

}