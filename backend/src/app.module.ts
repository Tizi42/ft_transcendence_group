import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BattlesModule } from './battles/battles.module';
import { typeOrmConfig } from './common/typeorm.config';
import { DataSource } from 'typeorm';
import { UsersController } from './users/users.controller';
import { BattlesController } from './battles/battles.controller';
import { UsersService } from './users/users.service';
import { BattlesService } from './battles/battles.service';
import { ChatModule } from './chat/chat.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    UsersModule,
    BattlesModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
