import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { Battle } from "../battles/battle.entity";
import { GameRoom } from "./utils/game";
 
@Injectable()
export class GameService {
  // constructor(
  //   @InjectRepository(Battle)
  //   private battlesRepository: Repository<Battle>,
  //   private usersService: UsersService
  // ) {}
}
