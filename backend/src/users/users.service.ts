import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "../channel/entities/channel.entity";
import { Chat } from "../chat/entities/chat.entity";
import { Any, DataSource, In, Not, Repository, UpdateResult } from "typeorm";
import { User } from "./users.entity";
import { FriendshipDto } from "./utils/friendship.dto";
import { UserDetails } from "./utils/types";
import { UserDto } from "./utils/user.dto";

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

      @InjectRepository(Channel)
      private readonly channelRepository: Repository<Channel>,

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

  async updateUserAvatar(id: number, filename: string, pictureUrl: string): Promise<UpdateResult> {
    return await this.usersRepository.update(id, {picture: pictureUrl, pictureLocalFilename: filename});
  }

  async displayNameAlreadyExist(newName: string): Promise<boolean> {
    const allUsers = await this.findAll();

    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].displayName === newName) {
        return true;
      }
    }
    return false;
  }

  async updateUserDisplayName(id: number, name: string) {
    if (await this.displayNameAlreadyExist(name)) {
      return { msg: "bad_name" };
    }
    return await this.usersRepository.update(id, {displayName: name});
  }

  async updateUserEmail(id: number, email: string) {
    return await this.usersRepository.update(id, {email: email});
  }


  /*
  **    CREATE/DELETE
  */

  async createNewUser(userDetails: UserDetails): Promise<User> {
    const newUser = this.usersRepository.create(userDetails);
    let nbr = 1;
    let displayNameTmp = newUser.displayName;
    while (await this.displayNameAlreadyExist(newUser.displayName)) {
      displayNameTmp = newUser.displayName;
      displayNameTmp += nbr.toString();
      nbr++;
    }
    newUser.displayName = displayNameTmp;
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

  async createFakeUsers(nb: number)
  {
    for (var i = 0; i < nb; i++) {
      let newUser = new User();
      newUser.displayName = "User" + i.toString();
      newUser.username = "username" + i.toString();
      newUser.email = "user" + i.toString() + "@student.42.fr";
	    await this.usersRepository.insert(newUser);
      console.log(newUser.displayName, "created");
    }
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    await this.chatRepository.delete({});
    await this.channelRepository.delete({});
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
    return (user.displayName);
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
 
  async findAll(): Promise<User[]> {
   return await this.usersRepository.find();
  }
  
  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  // getName(id: number): Promise<String> {
  //   return this.findOne(id).then((user) => user.displayName);
  // }

  async getUsername(id: number): Promise<String> {
    return this.findOne(id).then((user) => {
      if (user == null) return "";
      return user.username;
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email: email });
  }


  /*
  **    FRIENDS
  */

  async sendFriendRequest(param: FriendshipDto): Promise<User | null> {
    let askingForFriend = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (askingForFriend == null || target == null) {
      console.log("send friend request aborted");
      return null;
    }

    // check if already friends
    if (askingForFriend.friendWith.includes(target.id)) {
      console.log(askingForFriend.displayName, "and", target.displayName,"are already friends");
      return null;
    }

    //check if askingForFriend is blocked by target
    if (target.blocked.includes(askingForFriend.id, 0)) {
      console.log(askingForFriend.displayName, "is blocked by", target.displayName);
      return null;
    }

    askingForFriend.friendPendingReqTo.push(target.id);
    target.friendPendingReqFrom.push(askingForFriend.id);

    await this.usersRepository.save(target);
    await this.usersRepository.save(askingForFriend);

    console.log(askingForFriend.displayName, " sent a friend request to ", target.displayName);
    return askingForFriend;
  }

  async removeFriendRequest(param: FriendshipDto): Promise<User | null> {
    let askingForFriend = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (askingForFriend == null || target == null) {
      console.log("cancel friend request aborted");
      return null;
    }

    // remove from pending list
    let index = askingForFriend.friendPendingReqTo.indexOf(target.id);
    if (index > -1)
      askingForFriend.friendPendingReqTo.splice(index, 1);

    index = target.friendPendingReqFrom.indexOf(askingForFriend.id);
    if (index > -1)
      target.friendPendingReqFrom.splice(index, 1);

    await this.usersRepository.save(target);
    await this.usersRepository.save(askingForFriend);

    console.log(askingForFriend.displayName, "'s friend request to ", target.displayName, " is removed");
    return target;
  }

  async acceptFriendRequest(param: FriendshipDto): Promise<User | null> {
    let askingForFriend = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (askingForFriend == null || target == null) {
      console.log("accept friend request aborted");
      return null;
    }

    // check if already friends
    if (askingForFriend.friendWith.includes(target.id)) {
      console.log(askingForFriend.displayName, "and", target.displayName,"are already friends");
      return null;
    }

    // check if request exist and remove it from pending list
    let index = askingForFriend.friendPendingReqTo.indexOf(target.id);
    if (index == -1) {
      console.log("Friend request does not exist");
      return null;
    }
    askingForFriend.friendPendingReqTo.splice(index, 1);

    index = target.friendPendingReqFrom.indexOf(askingForFriend.id);
    if (index == -1) {
      console.log("Friend request does not exist");
      return null;
    }
    target.friendPendingReqFrom.splice(index, 1);

    //add friends
    askingForFriend.friendWith.push(target.id);
    target.friendWith.push(askingForFriend.id);

    await this.usersRepository.save(target);
    await this.usersRepository.save(askingForFriend);

    console.log(askingForFriend.displayName, " and ", target.displayName, "are friends now");
    return target;
  }

  async removeFriendship(param: FriendshipDto): Promise<User | null> {
    let removingFriend: User | null = await this.usersRepository.findOneBy({ id: param.id1 });
    let target: User | null = await this.usersRepository.findOneBy({ id: param.id2 });

    if (removingFriend == null || target == null) {
      console.log("friendship deletion aborted");
      return null;
    }

    if (!removingFriend.friendWith.includes(target.id)) {
      console.log(removingFriend.displayName, "and", target.displayName, "are not friends");
      return null;
    }
    
    let newFriendWithList = removingFriend.friendWith.filter(function(ele) {
      if (target == null) return true;
      return ele != target.id;
    });
    let newFriendOfList = target.friendWith.filter(function(ele){
      if (removingFriend == null) return true;
      return ele != removingFriend.id;
    });
    
    removingFriend.friendWith = newFriendWithList;
    target.friendWith = newFriendOfList;

    await this.usersRepository.save(target);
    await this.usersRepository.save(removingFriend);

    console.log(removingFriend.displayName, "and", target.displayName, "are no longer friends");
    return removingFriend;
  }

  async showFriendWith(id: number) : Promise<User[]> {
    const user: User | null = await this.usersRepository.findOneBy({ id });
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
    const user: User | null = await this.usersRepository.findOneBy({ id });
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
    const user: User | null = await this.usersRepository.findOneBy({ id });
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
    const user1: User | null = await this.usersRepository.findOneBy({ id: id });
    const user2: User | null = await this.usersRepository.findOneBy({ id: target });
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

  async blockRelationship(param: FriendshipDto): Promise<User | null> {
    let wantToBlock = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (wantToBlock == null || target == null) {
      console.log("block aborted");
      return null;
    }

    // check if already blocked
    if (wantToBlock.blocked.includes(target.id)) {
      console.log(wantToBlock.displayName, "has already blocked", target.displayName);
      return null;
    }

    // remove friendship if they are friends
    if (wantToBlock.friendWith.includes(target.id))
    {
      let newFriendWithList = wantToBlock.friendWith.filter(function(ele) {
        if (target == null) return;
        return ele != target.id;
      });
      let newFriendOfList = target.friendWith.filter(function(ele) {
        if (wantToBlock == null) return;
        return ele != wantToBlock.id;
      });
      
      wantToBlock.friendWith = newFriendWithList;
      target.friendWith = newFriendOfList;
    }

    // block target user
    wantToBlock.blocked.push(target.id);
    target.blockedBy.push(wantToBlock.id);

    await this.usersRepository.save(target);
    await this.usersRepository.save(wantToBlock);

    console.log(wantToBlock.displayName, "has blocked", target.displayName);
    return wantToBlock;
  }

  async unblockRelationship(param: FriendshipDto): Promise<User | null> {
    let wantToUnblock = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (wantToUnblock == null || target == null) {
      console.log("block aborted");
      return null;
    }

    // check if blocked
    if (!wantToUnblock.blocked.includes(target.id)) {
      console.log(wantToUnblock.displayName, "has not blocked", target.displayName);
      return null;
    }

    let newBlockedList = wantToUnblock.blocked.filter(function(ele) {
      if (target == null) return;
      return ele != target.id;
    });
    let newBlockedByList = target.blockedBy.filter(function(ele) {
      if (wantToUnblock == null) return;
      return ele != wantToUnblock.id;
    });
    
    wantToUnblock.blocked = newBlockedList;
    target.blockedBy = newBlockedByList;

    await this.usersRepository.save(target);
    await this.usersRepository.save(wantToUnblock);

    console.log(wantToUnblock.displayName, "has unblocked", target.displayName);
    return wantToUnblock;
  }

  async getBlocked(id: number) : Promise<User[]> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user == null)
    {
      console.log("no user matches this id");
      return [];
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
      return [];
    }
    return this.usersRepository.find({
        where: { id: Any(user.blockedBy) }
      });
  }

  /*
  **    AUTHENTICATION
  */

  async setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<UpdateResult> {
      return this.usersRepository.update(userId, {
          twoFactorAuthenticationSecret: secret
      });
  }

  async turnOnTwoFactorAuthentication(userId: number): Promise<UpdateResult> {
      return this.usersRepository.update(userId, {
          isTwoFactorAuthenticationEnabled: true,
      });
  }

  async turnOffTwoFactorAuthentication(userId: number): Promise<UpdateResult> {
      return this.usersRepository.update(userId, {
          isTwoFactorAuthenticationEnabled: false,
      });
  }

  async updateIsFirstEnablingTwoFactor(userId: number, value: boolean): Promise<UpdateResult> {
      return this.usersRepository.update(userId, {
          isFirstEnablingTwoFactor: value,
      });
  }
  
  async updateUserStatus(userId: number, value: string): Promise<UpdateResult> {
    console.log("update user status: ", userId, value);

    // Make sure offline user won't get online status on shutting down game room
    let newStatus = value;
    let user = await this.findOne(userId);
    if (user == null) return;
    let oldStatus = user.status;
    
    if (newStatus === "online" && oldStatus !== "offline")
      return;

    if (newStatus === "leave game") {
      if (oldStatus === "offline")
        return;
      newStatus = "online";
    }

    return await this.usersRepository.update(userId, {
        status: newStatus,
    });
  }

  /*
  **    GAME STATS
  */

  async updateResult(target: User, winner: boolean, draw: boolean): Promise<boolean> {
    target.totalGames++;
    if (winner) target.totalVictories++;
    else if (draw) target.totalDraws++;
    if (target.totalDraws == target.totalGames)
      target.winRate = -1;
    else {
      target.winRate = Math.floor(100 * target.totalVictories / (target.totalGames - target.totalDraws));
    }
    await this.usersRepository.save(target);
    return true;
  }

  async getLeadByVictories(global: boolean, id: number) : Promise<User[]> {
    let user = await this.findOne(id);
    if (user == null) return [];
    if (global)
      return this.usersRepository.find(
        {order: {totalVictories: "DESC"},
        where: {totalGames: Not(0)},
      });
    return this.usersRepository.find({
      order: {totalVictories: "DESC"},
      where: [
        {
          id: In(user.friendWith),
        },
        {
          id: id,
        },
      ],
    });
  }

  async getLeadByWinRate(global: boolean, id: number) : Promise<User[]> {
    let user = await this.findOne(id);
    if (user == null) return [];
    if (global)
      return this.usersRepository.find({
        order: {winRate: "DESC"},
        where: {totalGames: Not(0)},
      });
    return this.usersRepository.find({
      order: {winRate: "DESC"},
      where: [
        {
          id: In(user.friendWith),
        },
        {
          id: id,
        },
      ],
    });
  }

  async getLeadByGames(global: boolean, id: number) : Promise<User[]> {
    let user = await this.findOne(id);
    if (user == null) return [];
    if (global)
      return this.usersRepository.find({
        order: {totalGames: "DESC"},
        where: {totalGames: Not(0)},
      });
    return this.usersRepository.find({
      order: {totalGames: "DESC"},
      where: [
        {
          id: In(user.friendWith),
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
  **    CHANGE USER SETTINGS
  */

  async changeSettingNotification(id: number, value: boolean): Promise<User> {
    let user = await this.usersRepository.findOneBy({ id: id });
    if (user == null) return ;
    user.allowNotifications = value;
    await this.usersRepository.save(user);
  }
}
