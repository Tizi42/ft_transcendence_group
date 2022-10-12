"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChatModule = void 0;
var common_1 = require("@nestjs/common");
var jwt_1 = require("@nestjs/jwt");
var typeorm_1 = require("@nestjs/typeorm");
var auth_service_1 = require("../auth/auth.service");
var chat_controller_1 = require("../chat/chat.controller");
var chat_gateway_1 = require("../chat/chat.gateway");
var chat_service_1 = require("../chat/chat.service");
var chat_entity_1 = require("../chat/entities/chat.entity");
var users_entity_1 = require("../users/users.entity");
var users_module_1 = require("../users/users.module");
var channel_entity_1 = require("./entities/channel.entity");
var ChatModule = /** @class */ (function () {
    function ChatModule() {
    }
    ChatModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([users_entity_1.User, chat_entity_1.Chat, channel_entity_1.Channel]),
                users_module_1.UsersModule,
                jwt_1.JwtModule,
            ],
            providers: [
                chat_gateway_1.ChatGateway,
                chat_service_1.ChatService,
                auth_service_1.AuthService,
                chat_controller_1.ChatController,
            ],
            exports: [
                chat_service_1.ChatService,
                typeorm_1.TypeOrmModule.forFeature([chat_entity_1.Chat, channel_entity_1.Channel]),
            ],
            controllers: [
                chat_controller_1.ChatController,
            ]
        })
    ], ChatModule);
    return ChatModule;
}());
exports.ChatModule = ChatModule;
