import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FriendshipDto } from "./utils/friendship.dto";
import { User } from "./Users.entity";
import { UsersService } from "./users.service";

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/add')
  create(@Body() user: User) {
    return this.usersService.addOne(user);
  }

  @Get()
  getAll(): Promise<User[]>  {
    return this.usersService.findAll();
  };
  
  @Post('/addfriend')
  addFriend(@Body() friendship: FriendshipDto) {
    return this.usersService.createFriendship(friendship.id1, friendship.id2);
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