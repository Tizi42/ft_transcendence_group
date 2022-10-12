"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Battle = void 0;
var typeorm_1 = require("typeorm");
var Battle = /** @class */ (function () {
    function Battle() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Battle.prototype, "id");
    __decorate([
        (0, typeorm_1.CreateDateColumn)()
    ], Battle.prototype, "date_start");
    __decorate([
        (0, typeorm_1.Column)()
    ], Battle.prototype, "opponent1");
    __decorate([
        (0, typeorm_1.Column)()
    ], Battle.prototype, "opponent2");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], Battle.prototype, "score1");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], Battle.prototype, "score2");
    __decorate([
        (0, typeorm_1.Column)({ "default": undefined, nullable: true })
    ], Battle.prototype, "winner");
    __decorate([
        (0, typeorm_1.Column)({ "default": false })
    ], Battle.prototype, "isFinished");
    Battle = __decorate([
        (0, typeorm_1.Entity)({ name: 'battles' })
    ], Battle);
    return Battle;
}());
exports.Battle = Battle;
