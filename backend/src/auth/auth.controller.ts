import { Controller, Get, Req, Res, UseGuards, Post, HttpCode, Body, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";
import { UsersService } from "src/users/users.service";
import RequestWithUser from "src/users/utils/requestWithUser.interface";
import { AuthService } from "./auth.service";
import { TwoFactorAuthenticationCodeDto } from "./dto/2fa-authentication-code.dto";
import { FortyTwoAuthGuard } from "./guards/42-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @Get('42/login')
    @UseGuards(FortyTwoAuthGuard)
    handle42Login() {
        return { msg: "42 Authentication" };
    }

    @Get('42/redirect')
    @UseGuards(FortyTwoAuthGuard)
    handle42Redirect(@Req() request: RequestWithUser, @Res({ passthrough: true }) res: Response) {
        const { accessToken } = this.authService.login(request.user);
        res.cookie('jwt', accessToken);
        console.log(request.user);
        if (!request.user.isTwoFactorAuthenticationEnabled) {
            return res.redirect('http://localhost:8080/');
        }
        return request.user;
        // return res.redirect('2fa/authenticate'); redirect to a page to handle post with body action, (frontend)
    }

    @Post('2fa/generate')
    @UseGuards(JwtAuthGuard)
    async register(@Res() response: Response, @Req() request: RequestWithUser) {
        const { otpAuthUrl } = await this.authService.generateTwoFactorAuthenticationSecret(request.user);

        return this.authService.pipeQrCodeStream(response, otpAuthUrl);
    }

    @Post('2fa/turn-on')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication(
        @Req() request: RequestWithUser,
        @Body() { authenticationCode }: TwoFactorAuthenticationCodeDto
    ) {
        const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(authenticationCode, request.user);

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
    }

    @Post('2fa/authenticate')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async authenticate(
        @Req() request: RequestWithUser,
        @Body() { authenticationCode }: TwoFactorAuthenticationCodeDto
    ) {
        const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(authenticationCode, request.user);

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        // return request.res.redirect('http://localhost:8080/'); to redirect in home page frontend
        return request.user;
    }
}