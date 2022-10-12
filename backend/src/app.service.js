"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppService = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var AppService = /** @class */ (function () {
    function AppService() {
    }
    AppService.prototype.getHello = function () {
        console.log("MODE =", this.config.get('MODE'));
        console.log("DB_HOST =", this.config.get('DB_HOST'));
        console.log("DB_PORT =", this.config.get('DB_PORT'));
        console.log("DB_USER =", this.config.get('DB_USER'));
        console.log("DB_DATABASE =", this.config.get('DB_DATABASE'));
        return 'Hello World!';
    };
    __decorate([
        (0, common_1.Inject)(config_1.ConfigService)
    ], AppService.prototype, "config");
    AppService = __decorate([
        (0, common_1.Injectable)()
    ], AppService);
    return AppService;
}());
exports.AppService = AppService;
