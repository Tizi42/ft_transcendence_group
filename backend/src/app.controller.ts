import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { JwtTwoFactorGuard } from './auth/guards/jwt-2fa-auth.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersService } from './users/users.service';
import RequestWithUser from './users/utils/requestWithUser.interface';
import { UserDetails } from './users/utils/types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private usersService: UsersService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('createNewUser')
  create(@Body() body: UserDetails){
    this.usersService.createNewUser(body);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('private')
  getPrivate(@Req() req: Request) : Express.User {
    console.log("private cookies : ", req.cookies);
    console.log("private user : ", req.user);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('preAuth')
  getPreAuth(@Req() req: Request) {
    console.log("is Pre Authenticated ! ");
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() request: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    this.usersService.updateIsOnline(request.user.id, "offline");
  }
}
