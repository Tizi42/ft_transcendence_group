import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/channel/entities/channel.entity";
import { Chat } from "src/chat/entities/chat.entity";
import { AppGateway } from "src/gateway";
import { Any, DataSource, In, Not, QueryRunner, Repository } from "typeorm";
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
  
  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  // getName(id: number): Promise<String> {
  //   return this.findOne(id).then((user) => user.displayName);
  // }

  async getUsername(id: number): Promise<String> {
    return this.findOne(id).then((user) => user.username);
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email: email });
  }


  /*
  **    FRIENDS
  */

  async sendFriendRequest(param: FriendshipDto) {
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

  async removeFriendRequest(param: FriendshipDto) {
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

  async acceptFriendRequest(param: FriendshipDto) {
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

  async removeFriendship(param: FriendshipDto) {
    let removingFriend = await this.usersRepository.findOneBy({ id: param.id1 });
    let target = await this.usersRepository.findOneBy({ id: param.id2 });

    if (removingFriend == null || target == null) {
      console.log("friendship deletion aborted");
      return null;
    }

    if (!removingFriend.friendWith.includes(target.id)) {
      console.log(removingFriend.displayName, "and", target.displayName, "are not friends");
      return null;
    }
    
    let newFriendWithList = removingFriend.friendWith.filter(function(ele){ return ele != target.id });
    let newFriendOfList = target.friendWith.filter(function(ele){ return ele != removingFriend.id });
    
    removingFriend.friendWith = newFriendWithList;
    target.friendWith = newFriendOfList;

    await this.usersRepository.save(target);
    await this.usersRepository.save(removingFriend);

    console.log(removingFriend.displayName, "and", target.displayName, "are no longer friends");
    return removingFriend;
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
      let newFriendWithList = wantToBlock.friendWith.filter(function(ele){ return ele != target.id });
      let newFriendOfList = target.friendWith.filter(function(ele){ return ele != wantToBlock.id });
      
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

  async unblockRelationship(param: FriendshipDto) {
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

    let newBlockedList = wantToUnblock.blocked.filter(function(ele){ return ele != target.id });
    let newBlockedByList = target.blockedBy.filter(function(ele){ return ele != wantToUnblock.id });
    
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
  
  async updateUserStatus(userId: number, value: string) {
    console.log("update user status: ", userId, value);

    // Make sure offline user won't get online status on shutting down game room
    let newStatus = value;
    if (newStatus === "leave game") {
      let oldStatus = (await this.findOne(userId)).status;
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

  async updateResult(id: number, winner: boolean, draw: boolean) {
    let target = await this.usersRepository.findOneBy({ id });
    if (target == null) return ;
    target.totalGames++;
    if (winner) target.totalVictories++;
    else if (draw) target.totalDraws++;
    if (target.totalDraws == target.totalGames)
      target.winRate = -1;
    else {
      target.winRate = Math.floor(100 * target.totalVictories / (target.totalGames - target.totalDraws));
    }
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
  **    CHANGE USER SETTINGS
  */

  async changeSettingNotification(id: number, value: boolean) {
    let user = await this.usersRepository.findOneBy({ id: id });
    user.allowNotifications = value;
    await this.usersRepository.save(user);
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
