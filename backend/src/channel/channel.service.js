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
exports.ChannelService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var channel_entity_1 = require("./entities/channel.entity");
var ChannelService = /** @class */ (function () {
    function ChannelService(channelRepository, userService) {
        this.channelRepository = channelRepository;
        this.userService = userService;
    }
    ChannelService.prototype.createChannel = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var newChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newChannel = this.channelRepository.create(channel);
                        return [4 /*yield*/, this.channelRepository.save(newChannel)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, newChannel];
                }
            });
        });
    };
    ChannelService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelRepository.findOneBy({ id: id })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChannelService.prototype.leavingChannel = function (userId, channelId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, channel, i, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.findOneById(userId)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.findOne(channelId)];
                    case 2:
                        channel = _a.sent();
                        for (i = 0; i < channel.members.length; i++) {
                            if (channel.members[i] === user)
                                channel.members.splice(i, 1);
                        }
                        for (i = 0; i < channel.admins.length; i++) {
                            if (channel.admins[i] === user)
                                channel.admins.splice(i, 1);
                        }
                        if (userId === channel.owner.id) {
                            if (channel.admins[channel.admins.length - 1] !== null)
                                channel.owner.id = channel.admins[channel.admins.length - 1].id;
                            else
                                channel.owner.id = channel.members[channel.members.length - 1].id;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelService.prototype.joinChannel = function (userId, channelId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, channel, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.findOneById(userId)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.findOne(channelId)];
                    case 2:
                        channel = _a.sent();
                        for (i = 0; i < channel.banned.length; i++) {
                            if (channel.banned[i] === user)
                                return [2 /*return*/, console.log("unauthorized")];
                        }
                        channel.members.push(user);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelService.prototype.isAdmin = function (userId, channelId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, user, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(channelId)];
                    case 1:
                        channel = _a.sent();
                        return [4 /*yield*/, this.userService.findOneById(userId)];
                    case 2:
                        user = _a.sent();
                        for (i = 0; i < channel.admins.length; i++) {
                            if (channel.admins[i] === user)
                                return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    ChannelService.prototype.banUser = function (userId, channelId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(channelId)];
                    case 1:
                        channel = _a.sent();
                        return [4 /*yield*/, this.userService.findOneById(userId)];
                    case 2:
                        user = _a.sent();
                        channel.banned.push(user);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelService.prototype.addAdmin = function (userId, channelId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(channelId)];
                    case 1:
                        channel = _a.sent();
                        return [4 /*yield*/, this.userService.findOneById(userId)];
                    case 2:
                        user = _a.sent();
                        channel.admins.push(user);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelService.prototype.muteUser = function (userId, channelId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(channelId)];
                    case 1:
                        channel = _a.sent();
                        return [4 /*yield*/, this.userService.findOneById(userId)];
                    case 2:
                        user = _a.sent();
                        channel.muted.push(user);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelService.prototype.unMute = function (userId, channelId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, user, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(channelId)];
                    case 1:
                        channel = _a.sent();
                        return [4 /*yield*/, this.userService.findOneById(userId)];
                    case 2:
                        user = _a.sent();
                        for (i = 0; i < channel.muted.length; i++) {
                            if (channel.muted[i] === user)
                                channel.muted.splice(i, 1);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelService.prototype.unBan = function (userId, channelId) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, user, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(channelId)];
                    case 1:
                        channel = _a.sent();
                        return [4 /*yield*/, this.userService.findOneById(userId)];
                    case 2:
                        user = _a.sent();
                        for (i = 0; i < channel.banned.length; i++) {
                            if (channel.banned[i] === user)
                                channel.banned.splice(i, 1);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel))
    ], ChannelService);
    return ChannelService;
}());
exports.ChannelService = ChannelService;
