import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./Users.entity";
import { UserDetails } from "./utils/types";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOneBy({ email: email });
    }

    async createNewUser(userDetails: UserDetails): Promise<User> {
        const newUser = this.userRepository.create(userDetails);
        return await this.userRepository.save(newUser);
    }

    async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
        return this.userRepository.update(userId, {
            twoFactorAuthenticationSecret: secret
        });
    }

    async turnOnTwoFactorAuthentication(userId: number) {
        return this.userRepository.update(userId, {
            isTwoFactorAuthenticationEnabled: true,
        });
    }
}