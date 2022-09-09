import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./users.entity";
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

    findOne(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    async createNewUser(userDetails: UserDetails): Promise<User> {
        const newUser = this.userRepository.create(userDetails);
        return await this.userRepository.save(newUser);
    }
}