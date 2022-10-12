"use strict";
exports.__esModule = true;
exports.typeOrmConfig = void 0;
var config_1 = require("@nestjs/config");
var battle_entity_1 = require("../battles/battle.entity");
var channel_entity_1 = require("../channel/entities/channel.entity");
var chat_entity_1 = require("../chat/entities/chat.entity");
var users_entity_1 = require("../users/users.entity");
exports.typeOrmConfig = {
    imports: [config_1.ConfigModule],
    useFactory: function (configService) { return ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [users_entity_1.User, battle_entity_1.Battle, chat_entity_1.Chat, channel_entity_1.Channel],
        synchronize: true
    }); },
    inject: [config_1.ConfigService]
};
