import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Battle } from "./battle.entity";
import { BattlesService } from "./battles.service";

@Controller('/battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}
  
  @Get()
  getAll(): Promise<Battle[]>  {
    return this.battlesService.findAll();
  };

  @Post('/add')
  create(@Body() game: Battle) {
    return this.battlesService.addOne(game);
  }

  @Get(':id')
  getAllFor(@Param('id') id: number) : Promise<Battle[]> {
    let battles = this.battlesService.findAllFor(id);
    return (battles);
  }

}