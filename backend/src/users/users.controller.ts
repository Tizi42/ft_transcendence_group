import { Body, Controller, Get, Param, Query, Res, Req, Post, Put, UseInterceptors, UploadedFile, UseGuards } from "@nestjs/common";
import { FriendshipDto } from "./utils/friendship.dto";
import { User } from "./Users.entity";
import { UsersService } from "./users.service";
import { UserDto } from "./utils/user.dto";
import { Express, Request, Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { sharp } from "sharp";
import { extname } from "path";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { identity } from "rxjs";
import RequestWithUser from "./utils/requestWithUser.interface";

export const storage = {
  storage : diskStorage ({
    destination: './src/uploads/avatar',
      filename(req: RequestWithUser, file, callback) {
        console.log(req.user.id);
        callback(null , `avatar-${req.user.id}${extname(file.originalname)}`);
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

  @Get(':id')
  getOne(@Param('id') id: number): Promise<User>  {
    console.log("id is " + id);
    return this.usersService.findOne(id);
  };

  @UseGuards(JwtAuthGuard)
  @Put('uploads/avatar')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadAvatar(@Req() req: RequestWithUser, @UploadedFile() file: Express.Multer.File) : Promise<any> {
    console.log("File received, saved as " + file.filename);
    // const input = "../uploads/avatar/" + file.filename;
    // const output = "../uploads/avatar/lowRes_" + file.filename;
    // sharp(input)
    //   .resize(100, 100, {
    //     kernel: sharp.kernel.nearest,
    //     fit: 'contain',
    //     position: 'right top',
    //   })
    //   .toFile(output)
    //   .then(() => {
    //     // output.png is a 200 pixels wide and 300 pixels high image
    //     // containing a nearest-neighbour scaled version
    //     // contained within the north-east corner of a semi-transparent white canvas
    //   });
    return await this.usersService.updateUserAvatar(req.user.id, file.filename, "http://localhost:3000/api/users/avatar/" + req.user.id); //`${this.SERVER_URL}${file.path}`
  }

  @Get('avatar/:id')
  async getAvatar(@Param('id') id: number, @Res() res: Response): Promise<any> {
    let user = await this.usersService.findOne(id);
    if (user.pictureLocalFilename === "")
    {
      console.log("Using default avatar from 42 api...");
      return res.redirect(user.picture42URL); //?
    }
    return res.sendFile(user.pictureLocalFilename, { root: 'src/uploads/avatar'});
  }

  @Post('info/:id')
  setDisplayName(@Param('id') id: number, @Query('displayname') name: string) {
      return this.usersService.updateUserDisplayName(id, name);
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