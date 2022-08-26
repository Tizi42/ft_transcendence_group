import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";

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
	  entities: [__dirname + '/**/*.entity{.ts,.js}'],
	  synchronize: true,
	}),
	inject: [ConfigService],
}