import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Battle } from "./battle.entity";
import { BattlesService } from "./battles.service";
import { BattleShowDto } from "./utils/battle-show.dto";
import { BattleDto } from "./utils/battle.dto";

@Controller('/battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}
  
  @Get()
  getAll(): Promise<Battle[]>  {
    return this.battlesService.findAll();
  };
  
  @Get("/show")
  showAll(): Promise<BattleShowDto[]> {
    return this.battlesService.showAll();
  }

  @Post('/add')
  create(@Body() game: BattleDto) {
    return this.battlesService.addOne(game);
  }

  @Get(':id')
  getAllFor(@Param('id') id: number) : Promise<Battle[]> {
    return (this.battlesService.findAllFor(id));
  }

  // @Get('/end/:id/:winner')
  // end(@Param('id') id: number, @Param('winner') winner: number, ) {
  //   this.battlesService.end(id, winner);
  // }
}
