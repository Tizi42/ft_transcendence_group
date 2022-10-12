"use strict";
exports.__esModule = true;
exports.getEnvPath = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
function getEnvPath(dest) {
    var env = process.env.NODE_ENV;
    var fallback = (0, path_1.resolve)("".concat(dest, "/.env"));
    var filename = env ? "".concat(env, ".env") : 'development.env';
    var filePath = (0, path_1.resolve)("".concat(dest, "/").concat(filename));
    if (!(0, fs_1.existsSync)(filePath)) {
        filePath = fallback;
    }
    return filePath;
}
exports.getEnvPath = getEnvPath;
