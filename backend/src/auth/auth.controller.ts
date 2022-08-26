import { Controller, Get, Req, Res, UseGuards, Post } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { FortyTwoAuthGuard } from "./guards/42-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Get('42/login')
    @UseGuards(FortyTwoAuthGuard)
    handle42Login() {
        return { msg: "42 Authentication" };
    }

    @Get('42/redirect')
    @UseGuards(FortyTwoAuthGuard)
    handle42Redirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { accessToken } = this.authService.login(req.user);
        console.log("accesstoken == ", accessToken);
        res.cookie('jwt', accessToken);
        return req.user;
    }

    // @Post('2fa/generate')
    // @UseGuards(JwtAuthGuard)
    // async register(@Res() response: Response, @Req() request: Request) {
    //     const { otpAuthUrl } = await this.authService.generateTwoFactorAuthenticationSecret(request.user);
    // }
}