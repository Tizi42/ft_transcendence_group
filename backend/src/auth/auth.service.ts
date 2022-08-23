import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/Users.entity';
import { UsersService } from 'src/users/users.service';
import { UserDetails } from 'src/users/utils/types';
import { Repository } from 'typeorm';
import { JwtPayload } from './strategy/jwt.strategy';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async validateUser(userDetails: UserDetails): Promise<any> {
        const user = await this.usersService.findOneByEmail(userDetails.email);
        if (user) {
            return user;
        }
        return await this.usersService.createNewUser(userDetails);
    }

    login(user: any) {
        const payload: JwtPayload = { email: user.email, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
