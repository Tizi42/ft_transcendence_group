import { Body, Controller, Get, Param, Post, Put, UseInterceptors, UploadedFile, UseGuards } from "@nestjs/common";
import { FriendshipDto } from "./utils/friendship.dto";
import { User } from "./Users.entity";
import { UsersService } from "./users.service";
import { UserDto } from "./utils/user.dto";
import { Express } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { identity } from "rxjs";

export const storage = {
  storage : diskStorage ({
    destination: './src/uploads/avatar',
      filename(req, file, callback) {
        // need to change the way to get user id. Maybe use Of()
        console.log(req.headers.id);
        callback(null , `avatar-${req.headers.id}${extname(file.originalname)}`);
      },
  })
}

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): Promise<User[]>  {
    return this.usersService.findAll();
  };

  // @UseGuards(JwtAuthGuard)
  @Put('uploads/avatar/:id')
  @UseInterceptors(FileInterceptor('file', storage))
  updateAvatar(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    console.log("File received, saved as " + file.filename);
    return this.usersService.updateUserAvatar(id, file.filename);
  }

  @Post('/add')
  create(@Body() user: UserDto) {
    return this.usersService.addOne(user);
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