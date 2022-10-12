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
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var chat_entity_1 = require("../chat/entities/chat.entity");
var typeorm_2 = require("typeorm");
var users_entity_1 = require("./users.entity");
var UsersService = /** @class */ (function () {
    /*
    **    CONSTRUCTOR AND INJECTION OF USED REPOSITORY
    */
    function UsersService(usersRepository, chatRepository, dataSource) {
        this.usersRepository = usersRepository;
        this.chatRepository = chatRepository;
        this.dataSource = dataSource;
        this.LVL_FRIENDS = 0;
        this.LVL_PENDING = 1;
        this.LVL_REVERSE_PENDING = 2;
        this.LVL_NO_RELATION = 3;
    }
    /*
    **    UPDATE
    */
    UsersService.prototype.updateUserAvatar = function (id, filename, pictureUrl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.update(id, { picture: pictureUrl, pictureLocalFilename: filename })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsersService.prototype.updateUserDisplayName = function (id, name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersRepository.update(id, { displayName: name })];
            });
        });
    };
    UsersService.prototype.updateUserEmail = function (id, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersRepository.update(id, { email: email })];
            });
        });
    };
    /*
    **    CREATE/DELETE
    */
    UsersService.prototype.createNewUser = function (userDetails) {
        return __awaiter(this, void 0, void 0, function () {
            var newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newUser = this.usersRepository.create(userDetails);
                        return [4 /*yield*/, this.usersRepository.save(newUser)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsersService.prototype.addOne = function (userInfo) {
        var newUser = new users_entity_1.User();
        newUser.displayName = userInfo.displayName;
        newUser.username = userInfo.username;
        newUser.email = userInfo.email;
        newUser.picture = userInfo.picture;
        this.usersRepository.insert(newUser);
    };
    UsersService.prototype.getRandomInt = function (max) {
        if (max === void 0) { max = 100; }
        return Math.floor(Math.random() * max);
    };
    UsersService.prototype.createFakeUsers = function (nb) {
        for (var i = 0; i < nb; i++) {
            var newUser = new users_entity_1.User();
            newUser.displayName = "User" + i.toString();
            newUser.username = "username" + i.toString();
            newUser.email = "user" + i.toString() + "@student.42.fr";
            this.usersRepository.insert(newUser);
            var id = this.usersRepository.getId(newUser);
            newUser.picture = id;
            newUser.totalGames = this.getRandomInt() + 1;
            newUser.totalVictories = this.getRandomInt(newUser.totalGames);
            newUser.winRate = Math.floor((newUser.totalVictories / newUser.totalGames * 100));
        }
    };
    UsersService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository["delete"](id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.removeAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatRepository["delete"]({})];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.usersRepository["delete"]({})];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.restartIdSeq()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.restartIdSeq = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataSource.createQueryRunner().query("ALTER SEQUENCE users_id_seq RESTART WITH 1;")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
    **    GET USER INFORMATIONS
    */
    UsersService.prototype.getDisplayname = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (user == null)
                            return [2 /*return*/, ("")];
                        return [2 /*return*/, (user.username)];
                }
            });
        });
    };
    UsersService.prototype.getPicture = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (user == null)
                            return [2 /*return*/, ("")];
                        return [2 /*return*/, (user.picture)];
                }
            });
        });
    };
    UsersService.prototype.getPictureFilename = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (user == null)
                            return [2 /*return*/, ("")];
                        return [2 /*return*/, (user.pictureLocalFilename)];
                }
            });
        });
    };
    /*
    **    FIND USER
    */
    UsersService.prototype.findAll = function () {
        return this.usersRepository.find();
    };
    UsersService.prototype.findOne = function (id) {
        return this.usersRepository.findOneBy({ id: id });
    };
    UsersService.prototype.getName = function (id) {
        return this.findOne(id).then(function (user) { return user.displayName; });
    };
    UsersService.prototype.findOneById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersRepository.findOneBy({ id: id })];
            });
        });
    };
    UsersService.prototype.findOneByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersRepository.findOneBy({ email: email })];
            });
        });
    };
    /*
    **    FRIENDS
    */
    UsersService.prototype.sendFriendRequest = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var askingForFriend, target;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id1 })];
                    case 1:
                        askingForFriend = _a.sent();
                        return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id2 })];
                    case 2:
                        target = _a.sent();
                        if (askingForFriend == null || target == null)
                            return [2 /*return*/, console.log("send friend request aborted")];
                        // check if already friends
                        if (askingForFriend.friendWith.includes(target.id))
                            return [2 /*return*/, console.log(askingForFriend.displayName, "and", target.displayName, "are already friends")];
                        askingForFriend.friendPendingReqTo.push(target.id);
                        target.friendPendingReqFrom.push(askingForFriend.id);
                        this.usersRepository.save(target);
                        this.usersRepository.save(askingForFriend);
                        console.log(askingForFriend.displayName, " sent a friend request to ", target.displayName);
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.removeFriendRequest = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var askingForFriend, target, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id1 })];
                    case 1:
                        askingForFriend = _a.sent();
                        return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id2 })];
                    case 2:
                        target = _a.sent();
                        if (askingForFriend == null || target == null)
                            return [2 /*return*/, console.log("cancel friend reques aborted")];
                        index = askingForFriend.friendPendingReqTo.indexOf(target.id);
                        if (index > -1)
                            askingForFriend.friendPendingReqTo.splice(index, 1);
                        index = target.friendPendingReqFrom.indexOf(askingForFriend.id);
                        if (index > -1)
                            target.friendPendingReqFrom.splice(index, 1);
                        this.usersRepository.save(target);
                        this.usersRepository.save(askingForFriend);
                        console.log(askingForFriend.displayName, "'s friend request to ", target.displayName, " is removed");
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.acceptFriendRequest = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var askingForFriend, target, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id1 })];
                    case 1:
                        askingForFriend = _a.sent();
                        return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id2 })];
                    case 2:
                        target = _a.sent();
                        if (askingForFriend == null || target == null)
                            return [2 /*return*/, console.log("cancel friend reques aborted")];
                        // check if already friends
                        if (askingForFriend.friendWith.includes(target.id))
                            return [2 /*return*/, console.log(askingForFriend.displayName, "and", target.displayName, "are already friends")];
                        index = askingForFriend.friendPendingReqTo.indexOf(target.id);
                        if (index == -1)
                            return [2 /*return*/, console.log("Friend request does not exist")];
                        askingForFriend.friendPendingReqTo.splice(index, 1);
                        index = target.friendPendingReqFrom.indexOf(askingForFriend.id);
                        if (index == -1)
                            return [2 /*return*/, console.log("Friend request does not exist")];
                        target.friendPendingReqFrom.splice(index, 1);
                        //add friends
                        askingForFriend.friendWith.push(target.id);
                        target.friendWith.push(askingForFriend.id);
                        this.usersRepository.save(target);
                        this.usersRepository.save(askingForFriend);
                        console.log(askingForFriend.displayName, " and ", target.displayName, "are friends now");
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.removeFriendship = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var removingFriend, target, newFriendWithList, newFriendOfList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id1 })];
                    case 1:
                        removingFriend = _a.sent();
                        return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id2 })];
                    case 2:
                        target = _a.sent();
                        if (removingFriend == null || target == null)
                            return [2 /*return*/, console.log("friendship deletion aborted")];
                        if (!removingFriend.friendWith.includes(target.id))
                            return [2 /*return*/, console.log(removingFriend.displayName, "and", target.displayName, "are not friends")];
                        newFriendWithList = removingFriend.friendWith.filter(function (ele) { return ele != target.id; });
                        newFriendOfList = target.friendWith.filter(function (ele) { return ele != removingFriend.id; });
                        removingFriend.friendWith = newFriendWithList;
                        target.friendWith = newFriendOfList;
                        this.usersRepository.save(target);
                        this.usersRepository.save(removingFriend);
                        return [2 /*return*/, console.log(removingFriend.displayName, "and", target.displayName, "are no longer friends")];
                }
            });
        });
    };
    UsersService.prototype.showFriendWith = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (user == null) {
                            console.log("no user matches this id");
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.usersRepository.find({
                                where: { id: (0, typeorm_2.Any)(user.friendWith) }
                            })];
                }
            });
        });
    };
    UsersService.prototype.showFriendPendingReqTo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (user == null) {
                            console.log("no user matches this id");
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.usersRepository.find({
                                where: { id: (0, typeorm_2.Any)(user.friendPendingReqTo) }
                            })];
                }
            });
        });
    };
    UsersService.prototype.showFriendPendingReqFrom = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (user == null) {
                            console.log("no user matches this id");
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.usersRepository.find({
                                where: { id: (0, typeorm_2.Any)(user.friendPendingReqFrom) }
                            })];
                }
            });
        });
    };
    UsersService.prototype.getFriendLevel = function (id, target) {
        return __awaiter(this, void 0, void 0, function () {
            var user1, user2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (id == target)
                            return [2 /*return*/, this.LVL_FRIENDS];
                        return [4 /*yield*/, this.usersRepository.findOneBy({ id: id })];
                    case 1:
                        user1 = _a.sent();
                        return [4 /*yield*/, this.usersRepository.findOneBy({ id: target })];
                    case 2:
                        user2 = _a.sent();
                        if (user1 == null || user2 == null)
                            return [2 /*return*/, this.LVL_NO_RELATION];
                        if (user1.friendWith.includes(user2.id))
                            return [2 /*return*/, this.LVL_FRIENDS];
                        if (user1.friendPendingReqTo.includes(user2.id))
                            return [2 /*return*/, this.LVL_PENDING];
                        if (user1.friendPendingReqFrom.includes(user2.id))
                            return [2 /*return*/, this.LVL_REVERSE_PENDING];
                        return [2 /*return*/, this.LVL_NO_RELATION];
                }
            });
        });
    };
    /*
    **    BLOCKED
    */
    UsersService.prototype.blockRelationship = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var wantToBlock, target, newFriendWithList, newFriendOfList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id1 })];
                    case 1:
                        wantToBlock = _a.sent();
                        return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id2 })];
                    case 2:
                        target = _a.sent();
                        if (wantToBlock == null || target == null)
                            return [2 /*return*/, console.log("block aborted")];
                        // check if already blocked
                        if (wantToBlock.blocked.includes(target.id))
                            return [2 /*return*/, console.log(wantToBlock.displayName, "has already blocked", target.displayName)];
                        // remove friendship if they are friends
                        if (wantToBlock.friendWith.includes(target.id)) {
                            newFriendWithList = wantToBlock.friendWith.filter(function (ele) { return ele != target.id; });
                            newFriendOfList = target.friendWith.filter(function (ele) { return ele != wantToBlock.id; });
                            wantToBlock.friendWith = newFriendWithList;
                            target.friendWith = newFriendOfList;
                        }
                        // block target user
                        wantToBlock.blocked.push(target.id);
                        target.blockedBy.push(wantToBlock.id);
                        this.usersRepository.save(target);
                        this.usersRepository.save(wantToBlock);
                        console.log(wantToBlock.displayName, "has blocked", target.displayName);
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.unblockRelationship = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var wantToUnblock, target, newBlockedList, newBlockedByList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id1 })];
                    case 1:
                        wantToUnblock = _a.sent();
                        return [4 /*yield*/, this.usersRepository.findOneBy({ id: param.id2 })];
                    case 2:
                        target = _a.sent();
                        if (wantToUnblock == null || target == null)
                            return [2 /*return*/, console.log("block aborted")];
                        // check if blocked
                        if (!wantToUnblock.blocked.includes(target.id))
                            return [2 /*return*/, console.log(wantToUnblock.displayName, "has not blocked", target.displayName)];
                        newBlockedList = wantToUnblock.blocked.filter(function (ele) { return ele != target.id; });
                        newBlockedByList = target.blockedBy.filter(function (ele) { return ele != wantToUnblock.id; });
                        wantToUnblock.blocked = newBlockedList;
                        target.blockedBy = newBlockedByList;
                        this.usersRepository.save(target);
                        this.usersRepository.save(wantToUnblock);
                        console.log(wantToUnblock.displayName, "has unblocked", target.displayName);
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getBlocked = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (user == null) {
                            console.log("no user matches this id");
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.usersRepository.find({
                                where: { id: (0, typeorm_2.Any)(user.blocked) }
                            })];
                }
            });
        });
    };
    UsersService.prototype.getBlockedBy = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (user == null) {
                            console.log("no user matches this id");
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.usersRepository.find({
                                where: { id: (0, typeorm_2.Any)(user.blockedBy) }
                            })];
                }
            });
        });
    };
    /*
    **    AUTHENTICATION
    */
    UsersService.prototype.setTwoFactorAuthenticationSecret = function (secret, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersRepository.update(userId, {
                        twoFactorAuthenticationSecret: secret
                    })];
            });
        });
    };
    UsersService.prototype.turnOnTwoFactorAuthentication = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersRepository.update(userId, {
                        isTwoFactorAuthenticationEnabled: true
                    })];
            });
        });
    };
    UsersService.prototype.turnOffTwoFactorAuthentication = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersRepository.update(userId, {
                        isTwoFactorAuthenticationEnabled: false
                    })];
            });
        });
    };
    UsersService.prototype.updateIsFirstEnablingTwoFactor = function (userId, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersRepository.update(userId, {
                        isFirstEnablingTwoFactor: value
                    })];
            });
        });
    };
    UsersService.prototype.updateIsOnline = function (userId, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersRepository.update(userId, {
                        status: value
                    })];
            });
        });
    };
    /*
    **    GAME STATS
    */
    UsersService.prototype.updateResult = function (id, winner) {
        return __awaiter(this, void 0, void 0, function () {
            var target;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: id })];
                    case 1:
                        target = _a.sent();
                        target.totalGames++;
                        if (winner)
                            target.totalVictories++;
                        target.winRate = Math.floor((target.totalVictories / target.totalGames) * 100);
                        this.usersRepository.save(target);
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getLeadByVictories = function (global, id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            var _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (global)
                            return [2 /*return*/, this.usersRepository.find({ order: { totalVictories: "DESC" },
                                    where: { totalGames: (0, typeorm_2.Not)(0) }
                                })];
                        _b = (_a = this.usersRepository).find;
                        _d = {
                            order: { totalVictories: "DESC" }
                        };
                        _e = {
                            totalGames: (0, typeorm_2.Not)(0)
                        };
                        _c = typeorm_2.In;
                        return [4 /*yield*/, this.findOne(id)];
                    case 1: return [2 /*return*/, _b.apply(_a, [(_d.where = [
                                (_e.id = _c.apply(void 0, [(_f.sent()).friendWith]),
                                    _e),
                                {
                                    id: id
                                }
                            ],
                                _d)])];
                }
            });
        });
    };
    UsersService.prototype.getLeadByWinRate = function (global, id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            var _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (global)
                            return [2 /*return*/, this.usersRepository.find({
                                    order: { winRate: "DESC" },
                                    where: { totalGames: (0, typeorm_2.Not)(0) }
                                })];
                        _b = (_a = this.usersRepository).find;
                        _d = {
                            order: { winRate: "DESC" }
                        };
                        _e = {
                            totalGames: (0, typeorm_2.Not)(0)
                        };
                        _c = typeorm_2.In;
                        return [4 /*yield*/, this.findOne(id)];
                    case 1: return [2 /*return*/, _b.apply(_a, [(_d.where = [
                                (_e.id = _c.apply(void 0, [(_f.sent()).friendWith]),
                                    _e),
                                {
                                    id: id
                                }
                            ],
                                _d)])];
                }
            });
        });
    };
    UsersService.prototype.getLeadByGames = function (global, id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            var _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (global)
                            return [2 /*return*/, this.usersRepository.find({
                                    order: { totalGames: "DESC" },
                                    where: { totalGames: (0, typeorm_2.Not)(0) }
                                })];
                        _b = (_a = this.usersRepository).find;
                        _d = {
                            order: { totalGames: "DESC" }
                        };
                        _e = {
                            totalGames: (0, typeorm_2.Not)(0)
                        };
                        _c = typeorm_2.In;
                        return [4 /*yield*/, this.findOne(id)];
                    case 1: return [2 /*return*/, _b.apply(_a, [(_d.where = [
                                (_e.id = _c.apply(void 0, [(_f.sent()).friendWith]),
                                    _e),
                                {
                                    id: id
                                }
                            ],
                                _d)])];
                }
            });
        });
    };
    UsersService.prototype.getLeaderboard = function (order, id, global) {
        switch (order) {
            case 0:
                return this.getLeadByVictories(global, id);
            case 1:
                return this.getLeadByWinRate(global, id);
            default:
                return this.getLeadByGames(global, id);
        }
    };
    UsersService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
        __param(1, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat))
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
