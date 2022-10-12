"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChannelModule = void 0;
var common_1 = require("@nestjs/common");
var channel_service_1 = require("./channel.service");
var channel_controller_1 = require("./channel.controller");
var users_entity_1 = require("../users/users.entity");
var chat_entity_1 = require("../chat/entities/chat.entity");
var channel_entity_1 = require("./entities/channel.entity");
var typeorm_1 = require("@nestjs/typeorm");
var users_module_1 = require("../users/users.module");
var ChannelModule = /** @class */ (function () {
    function ChannelModule() {
    }
    ChannelModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([users_entity_1.User, chat_entity_1.Chat, channel_entity_1.Channel]),
                users_module_1.UsersModule
            ],
            providers: [channel_service_1.ChannelService],
            exports: [
                channel_service_1.ChannelService,
                typeorm_1.TypeOrmModule.forFeature([channel_entity_1.Channel]),
            ],
            controllers: [channel_controller_1.ChannelController]
        })
    ], ChannelModule);
    return ChannelModule;
}());
exports.ChannelModule = ChannelModule;
