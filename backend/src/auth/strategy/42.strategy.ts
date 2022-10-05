import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile } from "passport";
import { Strategy } from "passport-42";
import { VerifyCallback } from "passport-oauth2";
import { AuthService } from "../auth.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
    ) {
        super({
            clientID: process.env.FORTYTWO_CLIENT_UID,
            clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/api/auth/42/redirect",
            scope: ['public'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
        const user = await this.authService.validateUser({
            username: profile.username,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
        });
        
        done(null, user);
    }
}