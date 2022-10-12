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
exports.UsersController = exports.storage = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path_1 = require("path");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
exports.storage = {
    storage: (0, multer_1.diskStorage)({
        destination: './src/uploads/avatar',
        filename: function (req, file, callback) {
            console.log(req.user.id);
            callback(null, "avatar-".concat(req.user.id).concat((0, path_1.extname)(file.originalname)));
        }
    })
};
var UsersController = /** @class */ (function () {
    function UsersController(usersService) {
        this.usersService = usersService;
    }
    UsersController.prototype.getAll = function () {
        return this.usersService.findAll();
    };
    ;
    UsersController.prototype.uploadAvatar = function (req, file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("File received, saved as " + file.filename);
                        return [4 /*yield*/, this.usersService.updateUserAvatar(req.user.id, file.filename, "http://localhost:3000/api/users/avatar/" + req.user.id)];
                    case 1: return [2 /*return*/, _a.sent()]; //`${this.SERVER_URL}${file.path}`
                }
            });
        });
    };
    UsersController.prototype.getAvatar = function (id, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("send id");
                        return [4 /*yield*/, this.usersService.findOne(id)];
                    case 1:
                        user = _a.sent();
                        if (user.pictureLocalFilename === "") {
                            console.log("Using default avatar...");
                            return [2 /*return*/, res.sendFile("default.png", { root: 'src/uploads/avatar' })];
                        }
                        return [2 /*return*/, res.sendFile(user.pictureLocalFilename, { root: 'src/uploads/avatar' })];
                }
            });
        });
    };
    UsersController.prototype.getDefaultAvatar = function (res) {
        console.log("send default");
        return res.sendFile("default.png", { root: 'src/uploads/avatar' });
    };
    UsersController.prototype.setDisplayName = function (id, name) {
        return this.usersService.updateUserDisplayName(id, name);
    };
    UsersController.prototype.getOne = function (id) {
        return this.usersService.findOne(id);
    };
    ;
    UsersController.prototype.getName = function (id) {
        return this.usersService.getName(id);
    };
    ;
    // @Post('/add')
    // create(@Body() user: UserDto) {
    //   return this.usersService.addOne(user);
    // }
    UsersController.prototype.create = function (user) {
        return this.usersService.createNewUser(user);
    };
    // to delete 
    UsersController.prototype.removeAll = function () {
        return this.usersService.removeAll();
    };
    /*
    **    FRIENDS
    */
    UsersController.prototype.addFriend = function (friendship) {
        return this.usersService.sendFriendRequest(friendship);
    };
    UsersController.prototype.acceptFriend = function (friendship) {
        return this.usersService.acceptFriendRequest(friendship);
    };
    UsersController.prototype.ignoreFriendRequest = function (friendship) {
        return this.usersService.removeFriendRequest(friendship);
    };
    UsersController.prototype.removeFriend = function (friendship) {
        return this.usersService.removeFriendship(friendship);
    };
    UsersController.prototype.getFriends = function (id) {
        return this.usersService.showFriendWith(id);
    };
    UsersController.prototype.getFriendPendingReqTo = function (id) {
        return this.usersService.showFriendPendingReqTo(id);
    };
    UsersController.prototype.getFriendPendingReqFrom = function (id) {
        return this.usersService.showFriendPendingReqFrom(id);
    };
    UsersController.prototype.friendLevelWith = function (target, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.getFriendLevel(id, target)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /*
    **    BLOCKED
    */
    UsersController.prototype.block = function (friendship) {
        return this.usersService.blockRelationship(friendship);
    };
    UsersController.prototype.unblock = function (friendship) {
        return this.usersService.unblockRelationship(friendship);
    };
    UsersController.prototype.getBlocked = function (id) {
        return this.usersService.getBlocked(id);
    };
    UsersController.prototype.getBlockedby = function (id) {
        return this.usersService.getBlockedBy(id);
    };
    /*
    **    LEADERBOARD
    */
    UsersController.prototype.getLeaderboard = function (order, global, id) {
        return this.usersService.getLeaderboard(order, id, global);
    };
    __decorate([
        (0, common_1.Get)()
    ], UsersController.prototype, "getAll");
    __decorate([
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.Put)('uploads/avatar'),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', exports.storage)),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.UploadedFile)())
    ], UsersController.prototype, "uploadAvatar");
    __decorate([
        (0, common_1.Get)('avatar/:id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Res)())
    ], UsersController.prototype, "getAvatar");
    __decorate([
        (0, common_1.Get)('avatar_default'),
        __param(0, (0, common_1.Res)())
    ], UsersController.prototype, "getDefaultAvatar");
    __decorate([
        (0, common_1.Post)('info/:id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Query)('displayname'))
    ], UsersController.prototype, "setDisplayName");
    __decorate([
        (0, common_1.Get)('info/:id'),
        __param(0, (0, common_1.Param)('id'))
    ], UsersController.prototype, "getOne");
    __decorate([
        (0, common_1.Get)('name/:id'),
        __param(0, (0, common_1.Param)('id'))
    ], UsersController.prototype, "getName");
    __decorate([
        (0, common_1.Post)('/add'),
        __param(0, (0, common_1.Body)())
    ], UsersController.prototype, "create");
    __decorate([
        (0, common_1.Get)('/rm')
    ], UsersController.prototype, "removeAll");
    __decorate([
        (0, common_1.Post)('/friends/add'),
        __param(0, (0, common_1.Body)())
    ], UsersController.prototype, "addFriend");
    __decorate([
        (0, common_1.Post)('/friends/accept'),
        __param(0, (0, common_1.Body)())
    ], UsersController.prototype, "acceptFriend");
    __decorate([
        (0, common_1.Post)('/friends/ignore'),
        __param(0, (0, common_1.Body)())
    ], UsersController.prototype, "ignoreFriendRequest");
    __decorate([
        (0, common_1.Post)('/friends/rm'),
        __param(0, (0, common_1.Body)())
    ], UsersController.prototype, "removeFriend");
    __decorate([
        (0, common_1.Get)('/friends/:id'),
        __param(0, (0, common_1.Param)('id'))
    ], UsersController.prototype, "getFriends");
    __decorate([
        (0, common_1.Get)('/friends/to/:id'),
        __param(0, (0, common_1.Param)('id'))
    ], UsersController.prototype, "getFriendPendingReqTo");
    __decorate([
        (0, common_1.Get)('/friends/from/:id'),
        __param(0, (0, common_1.Param)('id'))
    ], UsersController.prototype, "getFriendPendingReqFrom");
    __decorate([
        (0, common_1.Get)('/friendship'),
        __param(0, (0, common_1.Query)('target')),
        __param(1, (0, common_1.Query)('mine'))
    ], UsersController.prototype, "friendLevelWith");
    __decorate([
        (0, common_1.Post)('/block/add'),
        __param(0, (0, common_1.Body)())
    ], UsersController.prototype, "block");
    __decorate([
        (0, common_1.Post)('/block/rm'),
        __param(0, (0, common_1.Body)())
    ], UsersController.prototype, "unblock");
    __decorate([
        (0, common_1.Get)('/block/:id'),
        __param(0, (0, common_1.Param)('id'))
    ], UsersController.prototype, "getBlocked");
    __decorate([
        (0, common_1.Get)('/blockby/:id'),
        __param(0, (0, common_1.Param)('id'))
    ], UsersController.prototype, "getBlockedby");
    __decorate([
        (0, common_1.Get)('/leaderboard'),
        __param(0, (0, common_1.Query)('order')),
        __param(1, (0, common_1.Query)('global')),
        __param(2, (0, common_1.Query)('mine'))
    ], UsersController.prototype, "getLeaderboard");
    UsersController = __decorate([
        (0, common_1.Controller)('/users')
    ], UsersController);
    return UsersController;
}());
exports.UsersController = UsersController;
