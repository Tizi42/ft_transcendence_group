"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Channel = void 0;
var users_entity_1 = require("../../users/users.entity");
var typeorm_1 = require("typeorm");
var Channel = /** @class */ (function () {
    function Channel() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Channel.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            "enum": ["private", "public", "protected", "toOne"],
            "default": "toOne"
        })
    ], Channel.prototype, "type");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return users_entity_1.User; }, function (author) { return author.messages; })
    ], Channel.prototype, "receiver");
    __decorate([
        (0, typeorm_1.Column)()
    ], Channel.prototype, "owner");
    __decorate([
        (0, typeorm_1.Column)()
    ], Channel.prototype, "admin");
    __decorate([
        (0, typeorm_1.Column)()
    ], Channel.prototype, "password");
    Channel = __decorate([
        (0, typeorm_1.Entity)({ name: 'channel' })
    ], Channel);
    return Channel;
}());
exports.Channel = Channel;
