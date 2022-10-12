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
exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var jwt_2fa_auth_guard_1 = require("./auth/guards/jwt-2fa-auth.guard");
var jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
var AppController = /** @class */ (function () {
    function AppController(appService, usersService) {
        this.appService = appService;
        this.usersService = usersService;
    }
    AppController.prototype.getHello = function () {
        return this.appService.getHello();
    };
    AppController.prototype.getPrivate = function (req) {
        // console.log("private cookies : ", req.cookies);
        // console.log("private user : ", req.user);
        return req.user;
    };
    AppController.prototype.getPreAuth = function (req) {
        console.log("is Pre Authenticated ! ");
    };
    AppController.prototype.logout = function (request, res) {
        res.clearCookie('jwt');
        this.usersService.updateIsOnline(request.user.id, "offline");
    };
    __decorate([
        (0, common_1.Get)()
    ], AppController.prototype, "getHello");
    __decorate([
        (0, common_1.UseGuards)(jwt_2fa_auth_guard_1.JwtTwoFactorGuard),
        (0, common_1.Get)('private'),
        __param(0, (0, common_1.Req)())
    ], AppController.prototype, "getPrivate");
    __decorate([
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.Get)('preAuth'),
        __param(0, (0, common_1.Req)())
    ], AppController.prototype, "getPreAuth");
    __decorate([
        (0, common_1.Get)('logout'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)({ passthrough: true }))
    ], AppController.prototype, "logout");
    AppController = __decorate([
        (0, common_1.Controller)()
    ], AppController);
    return AppController;
}());
exports.AppController = AppController;
