import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "src/chat/entities/chat.entity";
import { Any, DataSource, In, Not, QueryRunner, Repository } from "typeorm";
import { User } from "./users.entity";
import { FriendshipDto } from "./utils/friendship.dto";
import { UserDetails } from "./utils/types";
import { UserDto } from "./utils/user.dto";
import * as fs from "fs";
// import { HttpService } from "@nestjs/axios";

@Injectable()
export class UsersService {

  /*
  **    CONSTRUCTOR AND INJECTION OF USED REPOSITORY
  */

  constructor(
      @InjectRepository(User)
      private readonly usersRepository: Repository<User>,

      @InjectRepository(Chat)
      private readonly chatRepository: Repository<Chat>,

      private readonly dataSource: DataSource,

      // private readonly httpService: HttpService,
  ) {}

  readonly LVL_FRIENDS: number = 0;
  readonly LVL_PENDING: number = 1;
  readonly LVL_REVERSE_PENDING: number = 2;
  readonly LVL_NO_RELATION: number = 3;
  /*
  **    UPDATE
  */

  async updateUserAvatar(id: number, filename: string, pictureUrl: string): Promise<any> {
    return  await this.usersRepository.update(id, {picture: pictureUrl, pictureLocalFilename: filename});
  }

  async updateUserDisplayName(id: number, name: string): Promise<any> {
    return  this.usersRepository.update(id, {displayName: name});
  }

  async updateUserEmail(id: number, email: string): Promise<any> {
    return  this.usersRepository.update(id, {email: email});
  }


  /*
  **    CREATE/DELETE
  */

  async createNewUser(userDetails: UserDetails): Promise<User> {
    const newUser = this.usersRepository.create(userDetails);
    return await this.usersRepository.save(newUser);
  }

  addOne(userInfo: UserDto) {
    let newUser = new User();
    newUser.displayName = userInfo.displayName;
    newUser.username = userInfo.username;
    newUser.email = userInfo.email;
    newUser.picture = userInfo.picture;
	  this.usersRepository.insert(newUser);
  }

  getRandomInt(max: number = 100) : number {
    return Math.floor(Math.random() * max);
  }

  createFakeUsers(nb: number)
  {
    for (var i = 0; i < nb; i++) {
      let newUser = new User();
      newUser.displayName = "User" + i.toString();
      newUser.username = "username" + i.toString();
      newUser.email = "user" + i.toString() + "@student.42.fr";
	    this.usersRepository.insert(newUser);
      let id = this.usersRepository.getId(newUser);
      newUser.picture = id;
      newUser.totalGames = this.getRandomInt() + 1;
      newUser.totalVictories = this.getRandomInt(newUser.totalGames);
      newUser.winRate = Math.floor((newUser.totalVictories / newUser.totalGames * 100));
    }
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async needRecreate(): Promise<boolean> {
	return await this.usersRepository.count() < 10;
  }

  async removeAll(): Promise<void> {
    await this.chatRepository.delete({});
    await this.usersRepository.delete({});
    await this.restartIdSeq();
  }

  async restartIdSeq() {
    await this.dataSource.createQueryRunner().query(
      `ALTER SEQUENCE users_id_seq RESTART WITH 1;`
    )
  }


  /*
  **    GET USER INFORMATIONS
  */

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


  /*
  **    FIND USER
  */
 
  findAll(): Promise<User[]> {
   return this.usersRepository.find();
  }
  
  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  getName(id: number): Promise<String> {
    return this.findOne(id).then((user) => user.displayName);
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    console.log("Finding user by email...");
    return this.usersRepository.findOneBy({ email: email });
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
    const user: User = await this.usersRepository.findOneBy({ id });
    if (user == null)
    {
      console.log("no user matches this id");
      return [];
    }
    return this.usersRepository.find({
        where: { id: Any(user.friendWith) }
	  });
  }

  async showFriendPendingReqTo(id: number) : Promise<User[]> {
    const user: User = await this.usersRepository.findOneBy({ id });
    if (user == null)
    {
      console.log("no user matches this id");
      return [];
    }
    return this.usersRepository.find({
        where: { id: Any(user.friendPendingReqTo) }
      });
  }

  async showFriendPendingReqFrom(id: number) : Promise<User[]> {
    const user: User = await this.usersRepository.findOneBy({ id });
    if (user == null)
    {
      console.log("no user matches this id");
      return [];
    }
    return this.usersRepository.find({
        where: { id: Any(user.friendPendingReqFrom) }
      });
  }
  
  async getFriendLevel(id: number, target: number): Promise<number> {
    if (id == target)
      return this.LVL_FRIENDS;
    const user1: User = await this.usersRepository.findOneBy({ id: id });
    const user2: User = await this.usersRepository.findOneBy({ id: target });
    if (user1 == null || user2 == null)
      return this.LVL_NO_RELATION;
    if (user1.friendWith.includes(user2.id))
      return this.LVL_FRIENDS;
    if (user1.friendPendingReqTo.includes(user2.id))
      return this.LVL_PENDING;
    if (user1.friendPendingReqFrom.includes(user2.id))
      return this.LVL_REVERSE_PENDING;
    return this.LVL_NO_RELATION;
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

  /*
  **    AUTHENTICATION
  */

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
  
  async updateIsOnline(userId: number, value: string) {
    return this.usersRepository.update(userId, {
        status: value,
    });
  }

  /*
  **    GAME STATS
  */

  async updateResult(id: number, winner: boolean) {
    let target = await this.usersRepository.findOneBy({ id });
    target.totalGames++;
    if (winner)
      target.totalVictories++;
    target.winRate = Math.floor((target.totalVictories / target.totalGames) * 100);
    this.usersRepository.save(target);
  }

  async getLeadByVictories(global: boolean, id: number) : Promise<User[]> {
    if (global)
      return this.usersRepository.find(
        {order: {totalVictories: "DESC"},
        where: {totalGames: Not(0)},
      });
    return this.usersRepository.find({
      order: {totalVictories: "DESC"},
      where: [
        {
          id: In((await this.findOne(id)).friendWith),
        },
        {
          id: id,
        },
      ],
    });
  }

  async getLeadByWinRate(global: boolean, id: number) : Promise<User[]> {
    if (global)
      return this.usersRepository.find({
        order: {winRate: "DESC"},
        where: {totalGames: Not(0)},
      });
    return this.usersRepository.find({
      order: {winRate: "DESC"},
      where: [
        {
          id: In((await this.findOne(id)).friendWith),
        },
        {
          id: id,
        },
      ],
    });
  }

  async getLeadByGames(global: boolean, id: number) : Promise<User[]> {
    if (global)
      return this.usersRepository.find({
        order: {totalGames: "DESC"},
        where: {totalGames: Not(0)},
      });
    return this.usersRepository.find({
      order: {totalGames: "DESC"},
      where: [
        {
          id: In((await this.findOne(id)).friendWith),
        },
        {
          id: id,
        },
      ],
    });
  }

  getLeaderboard(order: number, id: number, global: boolean) : Promise<User[]> {
    switch (order) {
      case 0:
        return this.getLeadByVictories(global, id);
      case 1:
        return this.getLeadByWinRate(global, id);
      default:
        return this.getLeadByGames(global, id);
    }
  }

  /*
  **    OTHER
  */
  
  // async downloadImage(fromUrl: string, toLocation: string) {
  //   const writer = fs.createWriteStream(toLocation);
  
  //   const response = await this.httpService.axiosRef({
  //       url: fromUrl,
  //       method: 'GET',
  //       responseType: 'stream',
  //   });
  
  //   response.data.pipe(writer);
  
  //   return new Promise((resolve, reject) => {
  //       writer.on('finish', resolve);
  //       writer.on('error', reject);
  //   });
  // }

}
