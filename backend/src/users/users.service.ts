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

    async findOneById(id: number): Promise<User | undefined> {
        return this.userRepository.findOneBy({ id: id });
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

    async turnOffTwoFactorAuthentication(userId: number) {
        return this.userRepository.update(userId, {
            isTwoFactorAuthenticationEnabled: false,
        });
    }

    async updateIsFirstEnablingTwoFactor(userId: number, value: boolean) {
        return this.userRepository.update(userId, {
            isFirstEnablingTwoFactor: value,
        });
    }
}