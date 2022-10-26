import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Battle } from "./battle.entity";
import { BattlesService } from "./battles.service";
import { BattleShow } from "./utils/battle-show";
import { BattleDto } from "./utils/battle.dto";

@Controller('/battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}
  
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(): Promise<Battle[]>  {
    return this.battlesService.findAll();
  };
  
  @UseGuards(JwtAuthGuard)
  @Post('/add')
  create(@Body() game: BattleDto) {
    return this.battlesService.addOne(game);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/show")
  async showAll(): Promise<BattleShow[]> {
    return await this.battlesService.showAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/show/:id')
  async getAllFor(@Param('id') id: number) : Promise<BattleShow[]> {
    return await this.battlesService.showAll(id);
  }
}
