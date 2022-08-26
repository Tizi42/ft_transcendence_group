import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Any, DataSource, Repository } from "typeorm";
import { User } from "./Users.entity";
import { UserDetails } from "./utils/types";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private dataSource: DataSource
    ) {}

    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOneBy({ email: email });
    }

    async createNewUser(userDetails: UserDetails): Promise<User> {
        const newUser = this.usersRepository.create(userDetails);
        return await this.usersRepository.save(newUser);
    }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  addOne(user: User) {
	this.usersRepository.insert(user);
  }

  async createFriendship(id1: number, id2: number) {
	let askingForFriend = await this.usersRepository.findOneBy({ id: id1 });
	let target = await this.usersRepository.findOneBy({ id: id2 });
	if (askingForFriend == null || target == null)
		return console.log("friendship creation aborted");
	askingForFriend.friendWith.push(target.id);
	target.friendOf.push(askingForFriend.id);
	this.usersRepository.save(target);
	this.usersRepository.save(askingForFriend);
  }

  async showFriendWith(id: number) : Promise<User[]> {
	const user = await this.usersRepository.findOneBy({ id });
	return this.usersRepository.find({
	    where: { id: Any(user.friendWith) }
	  });
  }

  async showFriendOf(id: number) : Promise<User[]> {
    const user = await this.usersRepository.findOneBy({ id });
    return this.usersRepository.find({
        where: { id: Any(user.friendOf) }
      });
    }
}
