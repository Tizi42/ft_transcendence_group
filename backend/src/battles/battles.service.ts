import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/users.entity";
import { UsersService } from "../users/users.service";
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
      battles = await this.battlesRepository.find({
        where: [
            { isFinished: true },
        ],
        order: {date_start: "DESC"},
        take: 50,
      });
    } else {
      battles = await this.battlesRepository.find({
        where: [
          { opponent1: userId, isFinished: true },
          { opponent2: userId, isFinished: true },
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
      showbattle.mode = battle.mode;
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

  findOne(id: number): Promise<Battle | null> {
    return this.battlesRepository.findOneBy({id});
  }

  async remove(id: number): Promise<void> {
    await this.battlesRepository.delete(id);
  }

  async end(id: number, winner: number, score1: number, score2: number): Promise<boolean> {
    let battle = await this.battlesRepository.findOneBy({id});
    if (battle == null) return false;
    let draw: boolean = false;
    let winner1: boolean = (winner == battle.opponent1 ? true : false);
    let winner2: boolean = (winner == battle.opponent2 ? true : false);
    if (!winner1 && !winner2) draw = true;
    battle.winner = winner;
    battle.score1 = score1;
    battle.score2 = score2;
    battle.isFinished = true;
    let player1: User | null = await this.usersService.findOne(battle.opponent1);
    let player2: User | null = await this.usersService.findOne(battle.opponent2);
    if (player1 == null || player2 == null) return false;
    this.usersService.updateResult(player1, winner1, draw);
    this.usersService.updateResult(player2, winner2, draw);
    await this.battlesRepository.save(battle);
    return true;
  }

  async addOne(game: BattleDto): Promise<number> {
    let newBattle = new Battle();
    newBattle.opponent1 = game.opponent1;
    newBattle.opponent2 = game.opponent2;
    newBattle.date_start = new Date();
    newBattle.mode = game.mode;
	  let result = await this.battlesRepository.insert(newBattle);
    return (result.identifiers[0].id);
  }

  getRandomInt(max: number = 100) : number {
    return Math.floor(Math.random() * max);
  }

  getRandomMode(): string {
    let i = this.getRandomInt(3);
    if (i == 0) return "speed";
    if (i == 1) return "magic";
    return "normal";
  }

  async createFakeBattles(nb: number, maxId: number): Promise<number>
  {
    let created = 0;
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
      newBattle.mode = this.getRandomMode();
      newBattleDto.mode = newBattle.mode;
      newBattleDto.opponent1 = newBattle.opponent1;
      newBattleDto.opponent2 = newBattle.opponent2;
      newBattle.isFinished = true;
      let battleId = await this.addOne(newBattleDto);
      if (await this.end(battleId, newBattle.winner, newBattle.score1, newBattle.score2))
        created++;
    }

    // add draw situation
    let newBattle = new Battle();
    newBattle.opponent1 = 1;
    newBattle.opponent2 = 2;
    newBattle.winner = -1;
    newBattle.score1 = 4;
    newBattle.score2 = 4;
    newBattle.isFinished = true;
    newBattle.mode = this.getRandomMode();
    let newBattleDto = new BattleDto();
    newBattleDto.opponent1 = newBattle.opponent1;
    newBattleDto.opponent2 = newBattle.opponent2;
    newBattleDto.mode = newBattle.mode;
    let battleId = await this.addOne(newBattleDto);
    if (await this.end(battleId, newBattle.winner, newBattle.score1, newBattle.score2))
      created++;
    return created;
  }

  removeAll() {
    this.battlesRepository.clear();
  }
}