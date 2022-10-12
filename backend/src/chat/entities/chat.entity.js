"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Chat = void 0;
var users_entity_1 = require("../../users/users.entity");
var typeorm_1 = require("typeorm");
var Chat = /** @class */ (function () {
    function Chat() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Chat.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Chat.prototype, "content");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return users_entity_1.User; }, function (author) { return author.messages; })
    ], Chat.prototype, "dest");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return users_entity_1.User; }, function (author) { return author.messages; })
    ], Chat.prototype, "author");
    __decorate([
        (0, typeorm_1.Column)({ "default": -1 })
    ], Chat.prototype, "channelId");
    Chat = __decorate([
        (0, typeorm_1.Entity)({ name: 'chat' })
    ], Chat);
    return Chat;
}());
exports.Chat = Chat;
