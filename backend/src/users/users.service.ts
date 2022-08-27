import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Any, DataSource, Repository } from "typeorm";
import { User } from "./Users.entity";
import { FriendshipDto } from "./utils/friendship.dto";
import { UserDetails } from "./utils/types";
import { UserDto } from "./utils/user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private dataSource: DataSource
    ) {}

    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOneBy({ email: email });
    }

    async createNewUser(userDetails: UserDetails): Promise<User> {
        const newUser = this.usersRepository.create(userDetails);
        return await this.usersRepository.save(newUser);
    }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  addOne(userInfo: UserDto) {
    let newUser = new User();
    newUser.displayName = userInfo.displayName;
    newUser.username = userInfo.username;
	  this.usersRepository.insert(newUser);
  }

  async createFriendship(param: FriendshipDto) {
    let askingForFriend = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (askingForFriend == null || target == null)
      return console.log("friendship creation aborted");

    // check if already friends
    console.log(target.displayName, " ", askingForFriend.displayName);
    if (askingForFriend.friendWith.includes(target.id))
      return console.log("already friends");

    askingForFriend.friendWith.push(target.id);
    target.friendOf.push(askingForFriend.id);

    this.usersRepository.save(target);
    this.usersRepository.save(askingForFriend);
  }

  async showFriendWith(id: number) : Promise<User[]> {
    const user = await this.usersRepository.findOneBy({ id });
    return this.usersRepository.find({
        where: { id: Any(user.friendWith) }
	  });
  }

  async showFriendOf(id: number) : Promise<User[]> {
    const user = await this.usersRepository.findOneBy({ id });
    return this.usersRepository.find({
        where: { id: Any(user.friendOf) }
      });
    }
}
