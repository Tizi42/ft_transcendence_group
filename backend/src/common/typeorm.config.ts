import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { Battle } from "src/battles/battle.entity";
import { Chat } from "src/chat/entities/chat.entity";
import { User } from "src/users/Users.entity";

export const typeOrmConfig : TypeOrmModuleAsyncOptions = 
{
	imports: [ConfigModule],
	useFactory: (configService: ConfigService) => ({
	  type: 'postgres',
	  host: configService.get('DB_HOST'),
	  port: +configService.get('DB_PORT'),
	  username: configService.get('DB_USER'),
	  password: configService.get('DB_PASSWORD'),
	  database: configService.get('DB_DATABASE'),
	  entities: [User, Battle, Chat],
	  synchronize: true,
	}),
	inject: [ConfigService],
}