import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { JwtTwoFactorGuard } from './auth/guards/jwt-2fa-auth.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('private')
  getPrivate(@Req() req: Request) {
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
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
  }
}
