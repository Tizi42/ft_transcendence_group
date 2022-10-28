import { Controller, Get, Req, Res, UseGuards, Post, HttpCode, Body, UnauthorizedException, Logger, Query } from "@nestjs/common";
import { Response } from "express";
import { User } from "src/users/users.entity";
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
    handle42Login(): string {
        return "42 Authentication";
    }

    @Get('42/redirect')
    @UseGuards(FortyTwoAuthGuard)
    handle42Redirect(@Req() request: RequestWithUser, @Res({ passthrough: true }) res: Response) {
        const { accessToken } = this.authService.login(request.user, false);
        res.cookie('jwt', accessToken);
        res.redirect('http://localhost:8080/2FA');
    }

    // for development only: allow to log in with an existing email in db
    @Get('dev-only')
    async devUserLogin(@Query('email') email: string, @Res({ passthrough: true }) res: Response) {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        return "No such user";
      }
      const { accessToken } = this.authService.login(user, false);
      res.cookie('jwt', accessToken);
      res.redirect('http://localhost:8080/2FA');
    }

    @Post('2fa/generate')
    @UseGuards(JwtAuthGuard)
    async register(@Res() response: Response, @Req() request: RequestWithUser): Promise<void> {
        const { otpAuthUrl } = await this.authService.generateTwoFactorAuthenticationSecret(request.user);
        this.authService.pipeQrCodeStream(response, otpAuthUrl);
    }

    @Get('2fa/reGenerate')
    @UseGuards(JwtAuthGuard)
    async generateNewQrCode(@Req() request: RequestWithUser) {
        await this.usersService.updateIsFirstEnablingTwoFactor(request.user.id, true);
    }
    
    @Post('2fa/turn-on')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication(
        @Req() request: RequestWithUser,
        @Body() { authenticationCode }: TwoFactorAuthenticationCodeDto
    ): Promise<User> {
        const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(authenticationCode, request.user);
            
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        await this.usersService.updateIsFirstEnablingTwoFactor(request.user.id, false);
        await this.usersService.turnOnTwoFactorAuthentication(request.user.id);

        const { accessToken } = this.authService.login(request.user, true);
        request.res.cookie('jwt', accessToken);

        return request.user;
    }

    @Get('2fa/turn-off')
    @UseGuards(JwtAuthGuard)
    async turnOffTwoFactorAuthentication(@Req() request: RequestWithUser): Promise<User> {
        await this.usersService.turnOffTwoFactorAuthentication(request.user.id);
        return request.user;
    }

    @Post('2fa/authenticate')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async authenticate(
        @Req() request: RequestWithUser,
        @Body() { authenticationCode }: TwoFactorAuthenticationCodeDto,
    ): Promise<User> {
        const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(authenticationCode, request.user);

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        const { accessToken } = this.authService.login(request.user, true);
        request.res.cookie('jwt', accessToken);
        return request.user;
    }
}