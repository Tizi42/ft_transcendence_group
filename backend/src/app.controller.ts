import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { JwtTwoFactorGuard } from './auth/guards/jwt-2fa-auth.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersService } from './users/users.service';
import RequestWithUser from './users/utils/requestWithUser.interface';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(
    private readonly appService: AppService,
    private usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('private')
  getPrivate(@Req() req: Request) : Express.User {
    this.logger.verbose("cookies : ", JSON.stringify(req.cookies));
    this.logger.verbose("user : ", JSON.stringify(req.user));
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('preAuth')
  getPreAuth(@Req() req: Request) {
    this.logger.verbose("is Pre Authenticated ! ");
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() request: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    this.usersService.updateIsOnline(request.user.id, "offline");
  }
}
