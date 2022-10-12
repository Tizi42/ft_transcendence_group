"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.BattlesController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var BattlesController = /** @class */ (function () {
    function BattlesController(battlesService, datasource) {
        this.battlesService = battlesService;
        this.datasource = datasource;
    }
    BattlesController.prototype.getAll = function () {
        return this.battlesService.findAll();
    };
    ;
    BattlesController.prototype.showAll = function () {
        return this.battlesService.showAll();
    };
    BattlesController.prototype.create = function (game) {
        return this.battlesService.addOne(game);
    };
    BattlesController.prototype.getAllFor = function (id) {
        return (this.battlesService.findAllFor(id));
    };
    BattlesController.prototype.end = function (id, winner) {
        this.battlesService.end(id, winner);
    };
    __decorate([
        (0, common_1.Get)()
    ], BattlesController.prototype, "getAll");
    __decorate([
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.Get)("/show")
    ], BattlesController.prototype, "showAll");
    __decorate([
        (0, common_1.Post)('/add'),
        __param(0, (0, common_1.Body)())
    ], BattlesController.prototype, "create");
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], BattlesController.prototype, "getAllFor");
    __decorate([
        (0, common_1.Get)('/end/:id/:winner'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Param)('winner'))
    ], BattlesController.prototype, "end");
    BattlesController = __decorate([
        (0, common_1.Controller)('/battles')
    ], BattlesController);
    return BattlesController;
}());
exports.BattlesController = BattlesController;
