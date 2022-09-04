import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/Users.entity";
import { UsersService } from "src/users/users.service";
import { DataSource, Repository } from "typeorm";
import { Battle } from "./battle.entity";
import { BattleShowDto } from "./utils/battle-show.dto";
import { BattleDto } from "./utils/battle.dto";

@Injectable()
export class BattlesService {
  constructor(
    @InjectRepository(Battle)
    private battlesRepository: Repository<Battle>,
    private usersService: UsersService,
    private dataSource: DataSource
  ) {}

  findAll(): Promise<Battle[]> {
    return this.battlesRepository.find({order: {date_start: "ASC"}});
  }

  async showAll(): Promise<BattleShowDto[]> {
    let battles = await this.battlesRepository.find({order: {date_start: "ASC"}});
    let res = [];
    battles.forEach(async (battle) => {
      let showbattle = new BattleShowDto();
      showbattle.date = battle.date_start.toDateString();
      showbattle.time = battle.date_start.toTimeString();
      showbattle.opponent1 = await this.usersService.getDisplayname(battle.opponent1);
      showbattle.picture1 = await this.usersService.getPicture(battle.opponent1);
      showbattle.opponent2 = await this.usersService.getDisplayname(battle.opponent2);
      showbattle.picture2 = await this.usersService.getPicture(battle.opponent2);
      showbattle.winner = (battle.winner == battle.opponent1 ? 1 : 2);
      res.push(showbattle);
      console.log(showbattle.time);
    });
    return (res);
  }

  findAllFor(userId: number): Promise<Battle[]> {
    return this.battlesRepository.find({
        where: [
            { opponent1: userId, },
            { opponent2: userId },
        ],
    });
  }

  async changeStatus(id: number, winner: number) {
    let battle = await this.findOne(id);
    battle.isFinished = !battle.isFinished;
    if (winner == 1)
      battle.winner = battle.opponent1;
    else
      battle.winner = battle.opponent2;
    this.battlesRepository.save(battle);
  }

  findAllForUser(user: User): Promise<Battle[]> {
    return this.battlesRepository.find({
        where: [
            { opponent1: user.id, },
            { opponent2: user.id },
        ],
    });
  }

  async numberOfVictory(userId: number) : Promise<number>
  {
    let winBattle = await this.battlesRepository.count({ where: { winner: userId }});
    let totBattle = await this.battlesRepository.count({
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
    return this.battlesRepository.findOneBy({id});
  }

  async remove(id: number): Promise<void> {
    await this.battlesRepository.delete(id);
  }

  addOne(game: BattleDto) {
    let newBattle = new Battle();
    newBattle.opponent1 = game.opponent1;
    newBattle.opponent2 = game.opponent2;
	  this.battlesRepository.insert(newBattle);
  }
}