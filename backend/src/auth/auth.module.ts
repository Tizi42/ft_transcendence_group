import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './strategy/42.strategy';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.entity';
import { JwtAuthStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtTwoFactorStrategy } from './strategy/jwt-2fa.strategy';

@Module({
	imports: [
		UsersModule,
		TypeOrmModule.forFeature([User]),
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService) => {
				return {
					secret: configService.get<string>('JWT_SECRET'),
					signOptions: {
						expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
					},
				};
			},
			inject: [ConfigService],
		}),
	],
	providers: [
		AuthService,
		FortyTwoStrategy,
		JwtAuthStrategy,
		jwtTwoFactorStrategy
	],
	exports: [
		AuthService,
		JwtModule,
	],
	controllers: [AuthController],
})
export class AuthModule {}
