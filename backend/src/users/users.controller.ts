import { Body, Controller, Get, Param, Query, Res, Req, Post, Put, UseInterceptors, UploadedFile, UseGuards } from "@nestjs/common";
import { FriendshipDto } from "./utils/friendship.dto";
import { User } from "./users.entity";
import { UsersService } from "./users.service";
import { UserDto } from "./utils/user.dto";
import { Express, Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import RequestWithUser from "./utils/requestWithUser.interface";
import { SetDisplayNameDto } from "./utils/setDisplayName.dto";

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

  @UseGuards(JwtAuthGuard)
  @Put('uploads/avatar')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadAvatar(@Req() req: RequestWithUser, @UploadedFile() file: Express.Multer.File) : Promise<any> {
    return await this.usersService.updateUserAvatar(
      req.user.id, file.filename, "http://localhost:3000/api/users/avatar/" + req.user.id
    ); //`${this.SERVER_URL}${file.path}`
  }

  @Get('avatar/:id')
  async getAvatar(@Param('id') id: number, @Res() res: Response): Promise<any> {
    let user = await this.usersService.findOne(id);
    if (user.pictureLocalFilename === "")
      return res.sendFile("default.png", { root: 'src/uploads/avatar'});
    return res.sendFile(user.pictureLocalFilename, { root: 'src/uploads/avatar'});
  }

  @Get('avatar')
  async getMyAvatar(@Req() req: RequestWithUser, @Res() res: Response): Promise<any> {
    console.log(req.user);
    let user = await this.usersService.findOne(req.user.id);
    if (user.pictureLocalFilename === "")
      return res.sendFile("default.png", { root: 'src/uploads/avatar'});
    return res.sendFile(user.pictureLocalFilename, { root: 'src/uploads/avatar'});
  }

  @Get('avatar_default')
  getDefaultAvatar(@Res() res: Response) {
    return res.sendFile("default.png", { root: 'src/uploads/avatar'});
  }

  @UseGuards(JwtAuthGuard)
  @Post('info/')
  async setDisplayName(
    @Req() req: RequestWithUser,
    @Body() setDisplayNameDto: SetDisplayNameDto
  ) {
    return await this.usersService.updateUserDisplayName(req.user.id, setDisplayNameDto.displayname);
  }

  @Get('info/:id')
  getOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  };

  @Get('name/:id')
  getName(@Param('id') id: number): Promise<String> {
    return this.usersService.getDisplayname(id);
  };

  @Get('username/:id')
  getUsername(@Param('id') id: number): Promise<String> {
    return this.usersService.getUsername(id);
  };

  @Post('/add')
  create(@Body() user: UserDto) {
    return this.usersService.createNewUser(user);
  }
  
  /*
  **    FRIENDS
  */

  @Post('/friends/add')
  async addFriend(@Body() friendship: FriendshipDto) {
    return await this.usersService.sendFriendRequest(friendship);
  }

  @Post('/friends/accept')
  async acceptFriend(@Body() friendship: FriendshipDto) {
    return await this.usersService.acceptFriendRequest(friendship);
  }

  @Post('/friends/ignore')
  async ignoreFriendRequest(@Body() friendship: FriendshipDto) {
    return await this.usersService.removeFriendRequest(friendship);
  }

  @Post('/friends/rm')
  async removeFriend(@Body() friendship: FriendshipDto) {
    return await this.usersService.removeFriendship(friendship);
  }

  @Get('/friends/:id')
  getFriends(@Param('id') id: number) {
	  return this.usersService.showFriendWith(id);
  }

  @Get('/friends/to/:id')
  getFriendPendingReqTo(@Param('id') id: number) {
	  return this.usersService.showFriendPendingReqTo(id);
  }

  @Get('/friends/from/:id')
  async getFriendPendingReqFrom(@Param('id') id: number) {
	  return await this.usersService.showFriendPendingReqFrom(id);
  }

  @Get('/friendship')
  async friendLevelWith(@Query('target') target: number,
    @Query('mine') id: number): Promise<number> {
	  return await this.usersService.getFriendLevel(id, target);
  }

  /*
  **    BLOCKED
  */

  @Post('/block/add')
  async block(@Body() friendship: FriendshipDto) {
    return await this.usersService.blockRelationship(friendship);
  }

  @Post('/block/rm')
  async unblock(@Body() friendship: FriendshipDto) {
    return await this.usersService.unblockRelationship(friendship);
  }

  @Get('/block/:id')
  getBlocked(@Param('id') id: number) {
	  return this.usersService.getBlocked(id);
  }

  @Get('/blockby/:id')
  getBlockedby(@Param('id') id: number) {
	  return this.usersService.getBlockedBy(id);
  }

  /*
  **    LEADERBOARD
  */

  @Get('/leaderboard')
  getLeaderboard(@Query('order') order: number,
    @Query('global') global: boolean,
    @Query('mine') id: number) {
    return this.usersService.getLeaderboard(order, id, global);
  }
}