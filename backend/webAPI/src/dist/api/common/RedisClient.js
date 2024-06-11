"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.RedisClient = void 0;
const redis_1 = require("redis");
const logger_1 = __importDefault(require("../../common/logger"));
exports.RedisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || "redis://default:password@localhost:6379",
});
const connectRedis = async () => {
    exports.RedisClient.on("error", (err) => {
        logger_1.default.error(err);
    });
    exports.RedisClient.on("ready", () => {
        logger_1.default.info("Redis ready");
    });
    await exports.RedisClient.connect();
};
exports.connectRedis = connectRedis;
//# sourceMappingURL=RedisClient.js.map