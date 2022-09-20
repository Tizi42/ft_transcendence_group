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

  async updateUserAvatar(id: number, filename: string, pictureUrl: string): Promise<any> {
    return  await this.usersRepository.update(id, {picture: pictureUrl, pictureLocalFilename: filename});
  }

  async updateUserDisplayName(id: number, name: string): Promise<any> {
    return  this.usersRepository.update(id, {displayName: name});
  }

  async updateUserEmail(id: number, email: string): Promise<any> {
    return  this.usersRepository.update(id, {email: email});
  }

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
    let user = await this.usersRepository.findOneBy({ id });
    if (user == null)
      return ("");
    return (user.picture);
  }

  async getPictureFilename(id: number) : Promise<string> {
    let user = await this.usersRepository.findOneBy({ id });
    if (user == null)
      return ("");
    return (user.pictureLocalFilename);
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
    newUser.pictureLocalFilename = userInfo.pictureLocalFilename;
	  this.usersRepository.insert(newUser);
  }


  /*
  **    FRIENDS
  */

  async sendFriendRequest(param: FriendshipDto) {
    let askingForFriend = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (askingForFriend == null || target == null)
      return console.log("send friend request aborted");

    // check if already friends
    if (askingForFriend.friendWith.includes(target.id))
      return console.log(askingForFriend.displayName, "and", target.displayName,"are already friends");

    askingForFriend.friendPendingReqTo.push(target.id);
    target.friendPendingReqFrom.push(askingForFriend.id);

    this.usersRepository.save(target);
    this.usersRepository.save(askingForFriend);

    console.log(askingForFriend.displayName, " sent a friend request to ", target.displayName);
  }

  async removeFriendRequest(param: FriendshipDto) {
    let askingForFriend = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (askingForFriend == null || target == null)
      return console.log("cancel friend reques aborted");

    // remove from pending list
    let index = askingForFriend.friendPendingReqTo.indexOf(target.id);
    if (index > -1)
      askingForFriend.friendPendingReqTo.splice(index, 1);

    index = target.friendPendingReqFrom.indexOf(askingForFriend.id);
    if (index > -1)
      target.friendPendingReqFrom.splice(index, 1);

    this.usersRepository.save(target);
    this.usersRepository.save(askingForFriend);

    console.log(askingForFriend.displayName, "'s friend request to ", target.displayName, " is removed");
  }

  async acceptFriendRequest(param: FriendshipDto) {
    let askingForFriend = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (askingForFriend == null || target == null)
      return console.log("cancel friend reques aborted");

    // check if already friends
    if (askingForFriend.friendWith.includes(target.id))
      return console.log(askingForFriend.displayName, "and", target.displayName,"are already friends");

    // check if request exist and remove it from pending list
    let index = askingForFriend.friendPendingReqTo.indexOf(target.id);
    if (index == -1)
      return console.log("Friend request does not exist");
    askingForFriend.friendPendingReqTo.splice(index, 1);

    index = target.friendPendingReqFrom.indexOf(askingForFriend.id);
    if (index == -1)
      return console.log("Friend request does not exist");
    target.friendPendingReqFrom.splice(index, 1);

    //add friends
    askingForFriend.friendWith.push(target.id);
    target.friendWith.push(askingForFriend.id);

    this.usersRepository.save(target);
    this.usersRepository.save(askingForFriend);

    console.log(askingForFriend.displayName, " and ", target.displayName, "are friends now");
  }

  async removeFriendship(param: FriendshipDto) {
    let removingFriend = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (removingFriend == null || target == null)
      return console.log("friendship deletion aborted");

    if (!removingFriend.friendWith.includes(target.id))
      return console.log(removingFriend.displayName, "and", target.displayName, "are not friends");
    
    let newFriendWithList = removingFriend.friendWith.filter(function(ele){ return ele != target.id });
    let newFriendOfList = target.friendWith.filter(function(ele){ return ele != removingFriend.id });
    
    removingFriend.friendWith = newFriendWithList;
    target.friendWith = newFriendOfList;

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

  async showFriendPendingReqTo(id: number) : Promise<User[]> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user == null)
    {
      console.log("no user matches this id");
      return null;
    }
    return this.usersRepository.find({
        where: { id: Any(user.friendPendingReqTo) }
      });
  }

  async showFriendPendingReqFrom(id: number) : Promise<User[]> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user == null)
    {
      console.log("no user matches this id");
      return null;
    }
    return this.usersRepository.find({
        where: { id: Any(user.friendPendingReqFrom) }
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

    // remove friendship if they are friends
    if (wantToBlock.friendWith.includes(target.id))
    {
      let newFriendWithList = wantToBlock.friendWith.filter(function(ele){ return ele != target.id });
      let newFriendOfList = target.friendWith.filter(function(ele){ return ele != wantToBlock.id });
      
      wantToBlock.friendWith = newFriendWithList;
      target.friendWith = newFriendOfList;
    }

    // block target user
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
      return this.usersRepository.findOneBy({ id: id });
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
      return this.usersRepository.update(userId, {
          twoFactorAuthenticationSecret: secret
      });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
      return this.usersRepository.update(userId, {
          isTwoFactorAuthenticationEnabled: true,
      });
  }

  async turnOffTwoFactorAuthentication(userId: number) {
      return this.usersRepository.update(userId, {
          isTwoFactorAuthenticationEnabled: false,
      });
  }

  async updateIsFirstEnablingTwoFactor(userId: number, value: boolean) {
      return this.usersRepository.update(userId, {
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
