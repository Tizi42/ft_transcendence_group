import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FriendshipDto } from "./utils/friendship.dto";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { UserDto } from "./utils/user.dto";

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): Promise<User[]>  {
    return this.usersService.findAll();
  };

  @Get(':id')
  getUser(@Param('id') id): Promise<User>  {
    return this.usersService.findOne(id);
  };

  @Post('/add')
  create(@Body() user: UserDto) {
    return this.usersService.createNewUser(user);
  }

  // to delete 
  @Get('/rm/:id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  // to delete 
  @Get('/rm')
  removeAll() {
    return this.usersService.removeAll();
  }
  
  /*
  **    FRIENDS
  */

  @Post('/friends/add')
  addFriend(@Body() friendship: FriendshipDto) {
    return this.usersService.createFriendship(friendship);
  }

  @Post('/friends/rm')
  removeFriend(@Body() friendship: FriendshipDto) {
    return this.usersService.removeFriendship(friendship);
  }

  @Get('/friends/:id')
  showFriends(@Param('id') id: number) {
	  return this.usersService.showFriendWith(id);
  }

  @Get('/friendsof/:id')
  showFriendships(@Param('id') id: number) {
	  return this.usersService.showFriendOf(id);
  }

  /*
  **    BLOCKED
  */

  @Post('/block/add')
  block(@Body() friendship: FriendshipDto) {
    return this.usersService.blockRelationship(friendship);
  }

  @Post('/block/rm')
  unblock(@Body() friendship: FriendshipDto) {
    return this.usersService.unblockRelationship(friendship);
  }

  @Get('/block/:id')
  getBlocked(@Param('id') id: number) {
	  return this.usersService.getBlocked(id);
  }

  @Get('/blockby/:id')
  getBlockedby(@Param('id') id: number) {
	  return this.usersService.getBlockedBy(id);
  }
}