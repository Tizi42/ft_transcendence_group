"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BattlesModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var battles_service_1 = require("./battles.service");
var battles_controller_1 = require("./battles.controller");
var battle_entity_1 = require("./battle.entity");
var users_module_1 = require("../users/users.module");
var users_entity_1 = require("../users/users.entity");
var BattlesModule = /** @class */ (function () {
    function BattlesModule(battlesService) {
        var _this = this;
        this.battlesService = battlesService;
        this.battlesService.removeAll();
        setTimeout(function () {
            _this.battlesService.createFakeBattles(20, 9);
        }, 1000);
    }
    BattlesModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([battle_entity_1.Battle, users_entity_1.User]), users_module_1.UsersModule],
            providers: [battles_service_1.BattlesService],
            controllers: [battles_controller_1.BattlesController],
            exports: [
                battles_service_1.BattlesService,
                typeorm_1.TypeOrmModule.forFeature([battle_entity_1.Battle]),
            ]
        })
    ], BattlesModule);
    return BattlesModule;
}());
exports.BattlesModule = BattlesModule;
