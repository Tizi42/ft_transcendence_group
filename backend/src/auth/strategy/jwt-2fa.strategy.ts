import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { JwtPayload } from "./jwt.strategy";

@Injectable()
export class jwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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

    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.usersService.findOneByEmail(payload.email);

        if (!user) {
            throw new UnauthorizedException();
        }
        if (!user.isTwoFactorAuthenticationEnabled) {
            return user;
        }
        if (payload.isTwoFactorAuthenticatedEnabled) {
            return user;
        }
    }
}