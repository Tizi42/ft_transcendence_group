"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ChannelGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var gateway_1 = require("../gateway");
var ChannelGateway = /** @class */ (function (_super) {
    __extends(ChannelGateway, _super);
    function ChannelGateway(chatService, usersService, channelService) {
        var _this = _super.call(this, chatService, usersService, channelService) || this;
        _this.chatService = chatService;
        _this.usersService = usersService;
        _this.channelService = channelService;
        return _this;
    }
    ChannelGateway.prototype.handleConnection = function (socket) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    ChannelGateway.prototype.handleDisconnect = function (client) { };
    ChannelGateway.prototype.createChannel = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelService.createChannel(data)];
                    case 1:
                        channel = _a.sent();
                        this.server.sockets.emit('channel_created');
                        return [2 /*return*/, channel];
                }
            });
        });
    };
    ChannelGateway.prototype.joinChannel = function (data, socket) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelService.joinChannel(data.user, data.channel)];
                    case 1:
                        _a.sent();
                        this.server.sockets.to(socket.data.id).emit('joined_channel');
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelGateway.prototype.leaveChannel = function (data, socket) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.findOneById(data.user.id)];
                    case 1:
                        if ((_a.sent()) === null)
                            return [2 /*return*/, console.log("user don't exist")];
                        if (!(socket.data.id === data.user.id)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.channelService.leavingChannel(data.user, data.channel)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChannelGateway.prototype.removeMember = function (data, socket) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.findOneById(data.user.id)];
                    case 1:
                        if ((_a.sent()) === null)
                            return [2 /*return*/, console.log("user don't exist")];
                        return [4 /*yield*/, this.channelService.isAdmin(socket.data.id, data.channel.id)];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.channelService.leavingChannel(data.user, data.channel)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.channelService.banUser(data.user, data.channel)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, websockets_1.SubscribeMessage)('create_channel'),
        __param(0, (0, websockets_1.MessageBody)())
    ], ChannelGateway.prototype, "createChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)('join_channel'),
        __param(0, (0, websockets_1.MessageBody)()),
        __param(1, (0, websockets_1.ConnectedSocket)())
    ], ChannelGateway.prototype, "joinChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)('leave_channel'),
        __param(0, (0, websockets_1.MessageBody)()),
        __param(1, (0, websockets_1.ConnectedSocket)())
    ], ChannelGateway.prototype, "leaveChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)('ban_member'),
        __param(0, (0, websockets_1.MessageBody)()),
        __param(1, (0, websockets_1.ConnectedSocket)())
    ], ChannelGateway.prototype, "removeMember");
    return ChannelGateway;
}(gateway_1.AppGateway));
exports.ChannelGateway = ChannelGateway;
