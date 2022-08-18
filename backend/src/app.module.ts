import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
	ConfigModule.forRoot({ isGlobal: true }),
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: process.env.POSTGRES_HOST,
		port: Number(process.env.POSTGRES_PORT),
    	username: process.env.POSTGRES_USER,
    	password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		//Or just: url: process.env.DATABASE_URL,
		entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    	synchronize: false,
	})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
