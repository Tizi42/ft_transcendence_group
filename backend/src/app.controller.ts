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
    console.log(req.cookies);
    console.log(req.user);
    return req.user;
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
  }
}
