import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Any, DataSource, Repository } from "typeorm";
import { User } from "./Users.entity";
import { FriendshipDto } from "./utils/friendship.dto";
import { UserDetails } from "./utils/types";
import { UserDto } from "./utils/user.dto";

function arrayRemove(arr, value) { 
    
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

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
    if (askingForFriend.friendWith.includes(target.id))
      return console.log(askingForFriend.displayName, "and", target.displayName,"are already friends");

    askingForFriend.friendWith.push(target.id);
    target.friendOf.push(askingForFriend.id);

    this.usersRepository.save(target);
    this.usersRepository.save(askingForFriend);

    console.log(askingForFriend.displayName, "and", target.displayName, "are now friends");
  }

  async removeFriendship(param: FriendshipDto) {
    let removingFriend = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (removingFriend == null || target == null)
      return console.log("friendship deletion aborted");

    if (!removingFriend.friendWith.includes(target.id))
      return console.log(removingFriend.displayName, "and", target.displayName, "are not friends");
    let newFriendWithList = removingFriend.friendWith.filter(function(ele){ return ele != target.id });
    let newFriendOfList = target.friendOf.filter(function(ele){ return ele != removingFriend.id });
    
    removingFriend.friendWith = newFriendWithList;
    target.friendOf = newFriendOfList;

    this.usersRepository.save(target);
    this.usersRepository.save(removingFriend);
    return console.log(removingFriend.displayName, "and", target.displayName, "are no longer friends");
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
