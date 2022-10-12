"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var env_helper_1 = require("./common/helper/env.helper");
var typeorm_1 = require("@nestjs/typeorm");
var auth_module_1 = require("./auth/auth.module");
var battles_module_1 = require("./battles/battles.module");
var typeorm_config_1 = require("./common/typeorm.config");
var users_module_1 = require("./users/users.module");
var chat_module_1 = require("./chat/chat.module");
var gateway_1 = require("./gateway");
var channel_module_1 = require("./channel/channel.module");
var envFilePath = (0, env_helper_1.getEnvPath)("".concat(__dirname, "/common/envs"));
var AppModule = /** @class */ (function () {
    function AppModule(dataSource) {
        this.dataSource = dataSource;
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({ envFilePath: envFilePath, isGlobal: true }),
                typeorm_1.TypeOrmModule.forRootAsync(typeorm_config_1.typeOrmConfig),
                auth_module_1.AuthModule,
                battles_module_1.BattlesModule,
                users_module_1.UsersModule,
                chat_module_1.ChatModule,
                channel_module_1.ChannelModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [
                app_service_1.AppService,
                gateway_1.AppGateway,
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
