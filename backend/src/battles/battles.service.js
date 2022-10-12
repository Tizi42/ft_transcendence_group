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
exports.BattlesService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var battle_entity_1 = require("./battle.entity");
var battle_show_dto_1 = require("./utils/battle-show.dto");
var BattlesService = /** @class */ (function () {
    function BattlesService(battlesRepository, usersService) {
        this.battlesRepository = battlesRepository;
        this.usersService = usersService;
    }
    BattlesService.prototype.findAll = function () {
        return this.battlesRepository.find({ order: { date_start: "DESC" } });
    };
    BattlesService.prototype.showAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var battles, res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.battlesRepository.find({ order: { date_start: "DESC" } })];
                    case 1:
                        battles = _a.sent();
                        res = [];
                        battles.forEach(function (battle) { return __awaiter(_this, void 0, void 0, function () {
                            var showbattle, _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        showbattle = new battle_show_dto_1.BattleShowDto();
                                        showbattle.date = battle.date_start.toDateString();
                                        showbattle.time = battle.date_start.toTimeString();
                                        _a = showbattle;
                                        return [4 /*yield*/, this.usersService.getDisplayname(battle.opponent1)];
                                    case 1:
                                        _a.opponent1 = _e.sent();
                                        _b = showbattle;
                                        return [4 /*yield*/, this.usersService.getPicture(battle.opponent1)];
                                    case 2:
                                        _b.picture1 = _e.sent();
                                        _c = showbattle;
                                        return [4 /*yield*/, this.usersService.getDisplayname(battle.opponent2)];
                                    case 3:
                                        _c.opponent2 = _e.sent();
                                        _d = showbattle;
                                        return [4 /*yield*/, this.usersService.getPicture(battle.opponent2)];
                                    case 4:
                                        _d.picture2 = _e.sent();
                                        showbattle.winner = (battle.winner == battle.opponent1 ? 1 : 2);
                                        res.push(showbattle);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/, (res)];
                }
            });
        });
    };
    BattlesService.prototype.findAllFor = function (userId) {
        return this.battlesRepository.find({
            where: [
                { opponent1: userId },
                { opponent2: userId },
            ],
            order: { date_start: "DESC" }
        });
    };
    BattlesService.prototype.findAllForUser = function (user) {
        return this.battlesRepository.find({
            where: [
                { opponent1: user.id },
                { opponent2: user.id },
            ]
        });
    };
    BattlesService.prototype.findOne = function (id) {
        return this.battlesRepository.findOneBy({ id: id });
    };
    BattlesService.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.battlesRepository["delete"](id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BattlesService.prototype.end = function (id, winner) {
        return __awaiter(this, void 0, void 0, function () {
            var battle, looser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.battlesRepository.findOneBy({ id: id })];
                    case 1:
                        battle = _a.sent();
                        looser = (winner == battle.opponent1 ? battle.opponent2 : battle.opponent1);
                        battle.winner = winner;
                        this.battlesRepository.save(battle);
                        this.usersService.updateResult(winner, true);
                        this.usersService.updateResult(looser, false);
                        return [2 /*return*/];
                }
            });
        });
    };
    BattlesService.prototype.addOne = function (game) {
        var newBattle = new battle_entity_1.Battle();
        newBattle.opponent1 = game.opponent1;
        newBattle.opponent2 = game.opponent2;
        this.battlesRepository.insert(newBattle);
    };
    BattlesService.prototype.getRandomInt = function (max) {
        if (max === void 0) { max = 100; }
        return Math.floor(Math.random() * max);
    };
    BattlesService.prototype.createFakeBattles = function (nb, maxId) {
        for (var i = 0; i < nb; i++) {
            var newBattle = new battle_entity_1.Battle();
            newBattle.opponent1 = this.getRandomInt(maxId - 2) + 1;
            newBattle.opponent2 = newBattle.opponent1 + 1;
            newBattle.winner = (this.getRandomInt(2) >= 1 ? newBattle.opponent1 : newBattle.opponent2);
            if (newBattle.winner == newBattle.opponent1) {
                newBattle.score1 = 10;
                newBattle.score2 = this.getRandomInt(9);
            }
            else {
                newBattle.score1 = this.getRandomInt(9);
                newBattle.score2 = 10;
            }
            newBattle.isFinished = true;
            this.battlesRepository.insert(newBattle);
        }
    };
    BattlesService.prototype.removeAll = function () {
        this.battlesRepository.clear();
    };
    BattlesService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(battle_entity_1.Battle))
    ], BattlesService);
    return BattlesService;
}());
exports.BattlesService = BattlesService;
