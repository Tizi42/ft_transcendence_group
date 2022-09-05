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
      private readonly usersRepository: Repository<User>
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
      return this.usersRepository.findOneBy({ email: email });
  }

  async createNewUser(userDetails: UserDetails): Promise<User> {
      const newUser = this.usersRepository.create(userDetails);
      return await this.usersRepository.save(newUser);
  }
  
  async getDisplayname(id: number) : Promise<string> {
    let user = await this.usersRepository.findOneBy({id});
    if (user == null)
      return ("");
    return (user.username);
  }

  async getPicture(id: number) : Promise<string> {
    let user = await this.usersRepository.findOneBy({id});
    if (user == null)
      return ("");
    return (user.picture);
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

  async removeAll(): Promise<void> {
    await this.usersRepository.delete({});
  }

  addOne(userInfo: UserDto) {
    let newUser = new User();
    newUser.displayName = userInfo.displayName;
    newUser.username = userInfo.username;
    newUser.email = userInfo.email;
    newUser.picture = userInfo.picture;
	  this.usersRepository.insert(newUser);
  }


  /*
  **    FRIENDS
  */

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
    if (user == null)
    {
      console.log("no user matches this id");
      return null;
    }
    return this.usersRepository.find({
        where: { id: Any(user.friendWith) }
	  });
  }

  async showFriendOf(id: number) : Promise<User[]> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user == null)
    {
      console.log("no user matches this id");
      return null;
    }
    return this.usersRepository.find({
        where: { id: Any(user.friendOf) }
      });
  }


  /*
  **    BLOCKED
  */

  async blockRelationship(param: FriendshipDto) {
    let wantToBlock = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (wantToBlock == null || target == null)
      return console.log("block aborted");

    // check if already blocked
    if (wantToBlock.blocked.includes(target.id))
      return console.log(wantToBlock.displayName, "has already blocked", target.displayName);

    wantToBlock.blocked.push(target.id);
    target.blockedBy.push(wantToBlock.id);

    this.usersRepository.save(target);
    this.usersRepository.save(wantToBlock);

    console.log(wantToBlock.displayName, "has blocked", target.displayName);
  }

  async unblockRelationship(param: FriendshipDto) {
    let wantToUnblock = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (wantToUnblock == null || target == null)
      return console.log("block aborted");

    // check if blocked
    if (!wantToUnblock.blocked.includes(target.id))
      return console.log(wantToUnblock.displayName, "has not blocked", target.displayName);

    let newBlockedList = wantToUnblock.blocked.filter(function(ele){ return ele != target.id });
    let newBlockedByList = target.blockedBy.filter(function(ele){ return ele != wantToUnblock.id });
    
    wantToUnblock.blocked = newBlockedList;
    target.blockedBy = newBlockedByList;

    this.usersRepository.save(target);
    this.usersRepository.save(wantToUnblock);

    console.log(wantToUnblock.displayName, "has unblocked", target.displayName);
  }

  async getBlocked(id: number) : Promise<User[]> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user == null)
    {
      console.log("no user matches this id");
      return null;
    }
    return this.usersRepository.find({
        where: { id: Any(user.blocked) }
	  });
  }

  async findOneById(id: number): Promise<User | undefined> {
      return this.userRepository.findOneBy({ id: id });
  }

  async createNewUser(userDetails: UserDetails): Promise<User> {
      const newUser = this.userRepository.create(userDetails);
      return await this.userRepository.save(newUser);
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
      return this.userRepository.update(userId, {
          twoFactorAuthenticationSecret: secret
      });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
      return this.userRepository.update(userId, {
          isTwoFactorAuthenticationEnabled: true,
      });
  }

  async turnOffTwoFactorAuthentication(userId: number) {
      return this.userRepository.update(userId, {
          isTwoFactorAuthenticationEnabled: false,
      });
  }

  async updateIsFirstEnablingTwoFactor(userId: number, value: boolean) {
      return this.userRepository.update(userId, {
          isFirstEnablingTwoFactor: value,
      });
  }
    
  async getBlockedBy(id: number) : Promise<User[]> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user == null)
    {
      console.log("no user matches this id");
      return null;
    }
    return this.usersRepository.find({
        where: { id: Any(user.blockedBy) }
      });
  }
}
