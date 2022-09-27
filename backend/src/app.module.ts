import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BattlesModule } from './battles/battles.module';
import { typeOrmConfig } from './common/typeorm.config';
import { DataSource } from 'typeorm';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    BattlesModule,
    UsersModule,
    //ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
