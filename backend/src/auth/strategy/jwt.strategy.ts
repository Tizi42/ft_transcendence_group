import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from "src/users/users.service";

export type JwtPayload = { sub: number; email: string; isTwoFactorAuthenticatedEnabled: boolean };

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private usersService: UsersService,
    ) {
        const extractJwtFromCookie = (req: Request) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies['jwt'];
            }
            return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        };

        super({
            jwtFromRequest: extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    extractJwtFromCookie(req: Request) {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['jwt'];
        }
        return token;
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersService.findOneByEmail(payload.email);

        return {
            id: payload.sub,
            email: payload.email,
            ... user,
        };
    }
}