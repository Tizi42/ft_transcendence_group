import { Controller, Get, Inject, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersService } from './users/users.service';
import { UserDetails } from './users/utils/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Inject()
  private readonly userService: UsersService

  @Post('createNewUser')
  create(@Body() body: UserDetails){
    this.userService.createNewUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('private')
  getPrivate(@Req() req: Request) {
    console.log(req.cookies);
    console.log(req.user);
    return req.user;
  }
}
