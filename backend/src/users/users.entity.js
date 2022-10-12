"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.User = void 0;
var channel_entity_1 = require("../channel/entities/channel.entity");
var chat_entity_1 = require("../chat/entities/chat.entity");
var typeorm_1 = require("typeorm");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], User.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "username");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "displayName");
    __decorate([
        (0, typeorm_1.Column)({ "default": "nobody@42.intra.fr" })
    ], User.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)({ "default": "http://localhost:3000/api/users/avatar_default" })
    ], User.prototype, "picture");
    __decorate([
        (0, typeorm_1.Column)({ "default": "" })
    ], User.prototype, "pictureLocalFilename");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], User.prototype, "twoFactorAuthenticationSecret");
    __decorate([
        (0, typeorm_1.Column)({ "default": false })
    ], User.prototype, "isTwoFactorAuthenticationEnabled");
    __decorate([
        (0, typeorm_1.Column)({ "default": true })
    ], User.prototype, "isFirstEnablingTwoFactor");
    __decorate([
        (0, typeorm_1.Column)("int", { array: true, "default": {} })
    ], User.prototype, "friendWith");
    __decorate([
        (0, typeorm_1.Column)("int", { array: true, "default": {} })
    ], User.prototype, "friendPendingReqTo");
    __decorate([
        (0, typeorm_1.Column)("int", { array: true, "default": {} })
    ], User.prototype, "friendPendingReqFrom");
    __decorate([
        (0, typeorm_1.Column)("int", { array: true, "default": {} })
    ], User.prototype, "blocked");
    __decorate([
        (0, typeorm_1.Column)("int", { array: true, "default": {} })
    ], User.prototype, "blockedBy");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], User.prototype, "totalGames");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], User.prototype, "totalVictories");
    __decorate([
        (0, typeorm_1.Column)({ "default": -1, nullable: true })
    ], User.prototype, "winRate");
    __decorate([
        (0, typeorm_1.Column)({ "default": "offline" })
    ], User.prototype, "status");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return chat_entity_1.Chat; }, function (messages) { return messages.author; })
    ], User.prototype, "messages");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return channel_entity_1.Channel; }, function (channels) { return channels.members; })
    ], User.prototype, "channels");
    User = __decorate([
        (0, typeorm_1.Entity)({ name: 'users' })
    ], User);
    return User;
}());
exports.User = User;
