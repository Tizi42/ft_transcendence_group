import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Battle } from "./battle.entity";

@Injectable()
export class BattlesService {
  constructor(
    @InjectRepository(Battle)
    private gamessRepository: Repository<Battle>,
    private dataSource: DataSource
  ) {}

  findAll(): Promise<Battle[]> {
    return this.gamessRepository.find();
  }

  findAllFor(userId: number): Promise<Battle[]> {
    return this.gamessRepository.find({
        where: [
            { opponent1: userId, },
            { opponent2: userId },
        ],
    });
  }

  async numberOfVictory(userId: number) : Promise<number>
  {
    let winBattle = await this.gamessRepository.count({where: { winner: userId }});
    let totBattle = await this.gamessRepository.count({
      where: [
          { opponent1: userId, },
          { opponent2: userId },
      ],
    });
    let looses = totBattle - winBattle;
    console.log("user", userId, "\tvictories : ", winBattle, "/", totBattle);
    return (winBattle);
  }

  findOne(id: number): Promise<Battle> {
    return this.gamessRepository.findOneBy({id});
  }

  async remove(id: number): Promise<void> {
    await this.gamessRepository.delete(id);
  }

  addOne(game: Battle) {
	  this.gamessRepository.insert(game);
  }
}