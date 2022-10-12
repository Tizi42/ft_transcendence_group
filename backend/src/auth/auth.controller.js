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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var _42_auth_guard_1 = require("./guards/42-auth.guard");
var jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
var AuthController = /** @class */ (function () {
    function AuthController(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    AuthController.prototype.handle42Login = function () {
        return "42 Authentication";
    };
    AuthController.prototype.handle42Redirect = function (request, res) {
        var accessToken = this.authService.login(request.user, false).accessToken;
        res.cookie('jwt', accessToken);
        // if (!request.user.isTwoFactorAuthenticationEnabled) {
        // this.usersService.updateIsOnline(request.user.id, "online");
        // }
        res.redirect('http://localhost:8080/2FA');
    };
    // for development only: allow to log in with an existing email in db
    AuthController.prototype.devUserLogin = function (email, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.findOneByEmail(email)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, "No such user"];
                        }
                        accessToken = this.authService.login(user, false).accessToken;
                        res.cookie('jwt', accessToken);
                        //   console.log(user);
                        //   console.log("jwt 1 = ", accessToken);
                        //   if (!user.isTwoFactorAuthenticationEnabled) {
                        // this.usersService.updateIsOnline(user.id, "online");
                        //   }
                        res.redirect('http://localhost:8080/2FA');
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.register = function (response, request) {
        return __awaiter(this, void 0, void 0, function () {
            var otpAuthUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.generateTwoFactorAuthenticationSecret(request.user)];
                    case 1:
                        otpAuthUrl = (_a.sent()).otpAuthUrl;
                        return [2 /*return*/, this.authService.pipeQrCodeStream(response, otpAuthUrl)];
                }
            });
        });
    };
    AuthController.prototype.generateNewQrCode = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.updateIsFirstEnablingTwoFactor(request.user.id, true)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.turnOnTwoFactorAuthentication = function (request, _a) {
        var authenticationCode = _a.authenticationCode;
        return __awaiter(this, void 0, void 0, function () {
            var isCodeValid, accessToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(authenticationCode, request.user);
                        if (!isCodeValid) {
                            throw new common_1.UnauthorizedException('Wrong authentication code');
                        }
                        return [4 /*yield*/, this.usersService.updateIsFirstEnablingTwoFactor(request.user.id, false)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.usersService.turnOnTwoFactorAuthentication(request.user.id)];
                    case 2:
                        _b.sent();
                        accessToken = this.authService.login(request.user, true).accessToken;
                        request.res.cookie('jwt', accessToken);
                        return [2 /*return*/, request.user];
                }
            });
        });
    };
    AuthController.prototype.turnOffTwoFactorAuthentication = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.turnOffTwoFactorAuthentication(request.user.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, request.user];
                }
            });
        });
    };
    AuthController.prototype.authenticate = function (request, _a) {
        var authenticationCode = _a.authenticationCode;
        return __awaiter(this, void 0, void 0, function () {
            var isCodeValid, accessToken;
            return __generator(this, function (_b) {
                isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(authenticationCode, request.user);
                if (!isCodeValid) {
                    throw new common_1.UnauthorizedException('Wrong authentication code');
                }
                accessToken = this.authService.login(request.user, true).accessToken;
                request.res.cookie('jwt', accessToken);
                // this.usersService.updateIsOnline(request.user.id, "online");
                return [2 /*return*/, request.user];
            });
        });
    };
    __decorate([
        (0, common_1.Get)('42/login'),
        (0, common_1.UseGuards)(_42_auth_guard_1.FortyTwoAuthGuard)
    ], AuthController.prototype, "handle42Login");
    __decorate([
        (0, common_1.Get)('42/redirect'),
        (0, common_1.UseGuards)(_42_auth_guard_1.FortyTwoAuthGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)({ passthrough: true }))
    ], AuthController.prototype, "handle42Redirect");
    __decorate([
        (0, common_1.Get)('dev-only'),
        __param(0, (0, common_1.Query)('email')),
        __param(1, (0, common_1.Res)({ passthrough: true }))
    ], AuthController.prototype, "devUserLogin");
    __decorate([
        (0, common_1.Post)('2fa/generate'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, (0, common_1.Res)()),
        __param(1, (0, common_1.Req)())
    ], AuthController.prototype, "register");
    __decorate([
        (0, common_1.Get)('2fa/reGenerate'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, (0, common_1.Req)())
    ], AuthController.prototype, "generateNewQrCode");
    __decorate([
        (0, common_1.Post)('2fa/turn-on'),
        (0, common_1.HttpCode)(200),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], AuthController.prototype, "turnOnTwoFactorAuthentication");
    __decorate([
        (0, common_1.Get)('2fa/turn-off'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, (0, common_1.Req)())
    ], AuthController.prototype, "turnOffTwoFactorAuthentication");
    __decorate([
        (0, common_1.Post)('2fa/authenticate'),
        (0, common_1.HttpCode)(200),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], AuthController.prototype, "authenticate");
    AuthController = __decorate([
        (0, common_1.Controller)('auth')
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
