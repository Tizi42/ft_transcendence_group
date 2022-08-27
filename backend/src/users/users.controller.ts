import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FriendshipDto } from "./utils/friendship.dto";
import { User } from "./Users.entity";
import { UsersService } from "./users.service";
import { UserDto } from "./utils/user.dto";

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/add')
  create(@Body() user: UserDto) {
    return this.usersService.addOne(user);
  }

  @Get()
  getAll(): Promise<User[]>  {
    return this.usersService.findAll();
  };
  
  @Post('/addfriend')
  addFriend(@Body() friendship: FriendshipDto) {
    return this.usersService.createFriendship(friendship);
  }

  @Post('/rmfriend')
  remove(@Body() friendship: FriendshipDto) {
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

}