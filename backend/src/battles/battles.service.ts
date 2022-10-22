import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { Battle } from "./battle.entity";
import { BattleShow } from "./utils/battle-show";
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

  async showAll(userId?: number): Promise<BattleShow[]> {
    let battles: Battle[];
    if (userId === undefined) {
      battles = await this.battlesRepository.find({order: {date_start: "DESC"}, take: 50});
    } else {
      battles = await this.battlesRepository.find({
        where: [
            { opponent1: userId, },
            { opponent2: userId },
        ],
        order: {date_start: "DESC"},
        take: 50,
      });
    }
    let res = [];
    for (const battle of battles) {
      let showbattle = new BattleShow();
      showbattle.id = battle.id;
      showbattle.date = battle.date_start;
      showbattle.opponent1 = battle.opponent1;
      showbattle.name1 = await this.usersService.getDisplayname(battle.opponent1);
      showbattle.picture1 = await this.usersService.getPicture(battle.opponent1);
      showbattle.opponent2 = battle.opponent2;
      showbattle.name2 = await this.usersService.getDisplayname(battle.opponent2);
      showbattle.picture2 = await this.usersService.getPicture(battle.opponent2);
      showbattle.winner = battle.winner;
      showbattle.score1 = battle.score1;
      showbattle.score2 = battle.score2;
      showbattle.isFinished = battle.isFinished;
      res.push(showbattle);
    }
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

  async end(id: number, winner: number, score1: number, score2: number) {
    let battle = await this.battlesRepository.findOneBy({id});
    let draw: boolean = false;
    let winner1: boolean = (winner == battle.opponent1 ? true : false);
    let winner2: boolean = (winner == battle.opponent2 ? true : false);
    if (!winner1 && !winner2) draw = true;
    battle.winner = winner;
    battle.score1 = score1;
    battle.score2 = score2;
    battle.isFinished = true;
    this.battlesRepository.save(battle);
    this.usersService.updateResult(battle.opponent1, winner1, draw);
    this.usersService.updateResult(battle.opponent2, winner2, draw);
  }

  async addOne(game: BattleDto): Promise<number> {
    let newBattle = new Battle();
    newBattle.opponent1 = game.opponent1;
    newBattle.opponent2 = game.opponent2;
    newBattle.date_start = new Date();
	  let result = await this.battlesRepository.insert(newBattle);
    return (result.identifiers[0].id);
  }

  getRandomInt(max: number = 100) : number {
    return Math.floor(Math.random() * max);
  }

  async createFakeBattles(nb: number, maxId: number)
  {
    for (var i = 0; i < nb; i++) {
      let newBattle = new Battle();
      let newBattleDto = new BattleDto();
      newBattle.opponent1 = this.getRandomInt(maxId - 2) + 1;
      newBattle.opponent2 = newBattle.opponent1 + 1;
      newBattle.winner = (this.getRandomInt(2) >= 1 ? newBattle.opponent1 : newBattle.opponent2);
      if (newBattle.winner == newBattle.opponent1) {
        newBattle.score1 = 11;
        newBattle.score2 = this.getRandomInt(9);
      } else {
        newBattle.score1 = this.getRandomInt(9);
        newBattle.score2 = 11;
      }
      newBattleDto.opponent1 = newBattle.opponent1;
      newBattleDto.opponent2 = newBattle.opponent2;
      newBattle.isFinished = true;
      let battleId = await this.addOne(newBattleDto);
      this.end(battleId, newBattle.winner, newBattle.score1, newBattle.score2);
    }

    // add draw situation
    let newBattle = new Battle();
    newBattle.opponent1 = 11;
    newBattle.opponent2 = 2;
    newBattle.winner = -1;
    newBattle.score1 = 4;
    newBattle.score2 = 4;
    newBattle.isFinished = true;
    let newBattleDto = new BattleDto();
    newBattleDto.opponent1 = newBattle.opponent1;
    newBattleDto.opponent2 = newBattle.opponent2;
    let battleId = await this.addOne(newBattleDto);
    this.end(battleId, newBattle.winner, newBattle.score1, newBattle.score2);
  }

  removeAll() {
    this.battlesRepository.clear();
  }
}