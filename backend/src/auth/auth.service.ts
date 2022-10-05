import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { User } from "src/users/users.entity";
import { UsersService } from 'src/users/users.service';
import { UserDetails } from 'src/users/utils/types';
import { Repository } from 'typeorm';
import { JwtPayload} from './strategy/jwt.strategy';
import { toFileStream } from 'qrcode';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    /***Two Factor Authentication***/

    async generateTwoFactorAuthenticationSecret(user: User) {
        const secret = authenticator.generateSecret();

        const otpAuthUrl = authenticator.keyuri(user.email, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);

        await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

        return {
            secret,
            otpAuthUrl,
        }
    }

    async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
        return toFileStream(stream, otpAuthUrl);
    }

    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.twoFactorAuthenticationSecret,
        });
    }

    /***User Token verification from cookie for socket***/

    async getUserFromAuthenticationToken(token: string) {
        const payload: JwtPayload = this.jwtService.verify(token, {
            secret: this.configService.get('JWT_SECRET')
        });

        if (payload.sub) {
            return this.usersService.findOne(payload.sub);
        }
    }

    /***Valid User and Login***/

    async validateUser(userDetails: UserDetails): Promise<any> {
        const user = await this.usersService.findOneByEmail(userDetails.email);
        if (user) {
            return user;
        }
        return await this.usersService.createNewUser(userDetails);
    }

    login(user: User, isTwoFactorAuthenticated: boolean) {
        const payload: JwtPayload = { email: user.email, sub: user.id, isTwoFactorAuthenticatedEnabled: isTwoFactorAuthenticated };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
