import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/Users.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { Battle } from "./battle.entity";
import { BattleShowDto } from "./utils/battle-show.dto";
import { BattleDto } from "./utils/battle.dto";

@Injectable()
export class BattlesService {
  constructor(
    @InjectRepository(Battle)
    private battlesRepository: Repository<Battle>,
    private usersService: UsersService
  ) {}

  findAll(): Promise<Battle[]> {
    return this.battlesRepository.find({order: {date_start: "DESC"}});
  }

  async showAll(): Promise<BattleShowDto[]> {
    let battles = await this.battlesRepository.find({order: {date_start: "DESC"}});
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
    });
    return (res);
  }

  findAllFor(userId: number): Promise<Battle[]> {
    return this.battlesRepository.find({
        where: [
            { opponent1: userId, },
            { opponent2: userId },
        ],
        order: {date_start: "DESC"},
    });
  }

  findAllForUser(user: User): Promise<Battle[]> {
    return this.battlesRepository.find({
        where: [
            { opponent1: user.id, },
            { opponent2: user.id },
        ],
    });
  }

  findOne(id: number): Promise<Battle> {
    return this.battlesRepository.findOneBy({id});
  }

  async remove(id: number): Promise<void> {
    await this.battlesRepository.delete(id);
  }

  async end(id: number, winner: number) {
    let battle = await this.battlesRepository.findOneBy({id});
    let looser: number = (winner == battle.opponent1 ? battle.opponent2 : battle.opponent1);
    battle.winner = winner;
    this.battlesRepository.save(battle);
    this.usersService.updateResult(winner, true);
    this.usersService.updateResult(looser, false);
  }

  addOne(game: BattleDto) {
    let newBattle = new Battle();
    newBattle.opponent1 = game.opponent1;
    newBattle.opponent2 = game.opponent2;
	  this.battlesRepository.insert(newBattle);
  }

  getRandomInt(max: number = 100) : number {
    return Math.floor(Math.random() * max);
  }

  createFakeBattles(nb: number, maxId: number)
  {
    for (var i = 0; i < nb; i++) {
      let newBattle = new Battle();
      newBattle.opponent1 = this.getRandomInt(maxId - 2) + 1;
      newBattle.opponent2 = newBattle.opponent1 + 1;
      newBattle.winner = (this.getRandomInt(2) >= 1 ? newBattle.opponent1 : newBattle.opponent2);
      if (newBattle.winner == newBattle.opponent1) {
        newBattle.score1 = 10;
        newBattle.score2 = this.getRandomInt(9);
      } else {
        newBattle.score1 = this.getRandomInt(9);
        newBattle.score2 = 10;
      }
      newBattle.isFinished = true;
      this.battlesRepository.insert(newBattle);
    }
  }

  removeAll() {
    this.battlesRepository.clear();
  }
}