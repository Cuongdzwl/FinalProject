"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const logger_1 = __importDefault(require("./logger"));
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://default:password@localhost:6379',
});
exports.redisClient.on('error', (err) => {
    logger_1.default.error('Redis error:', err);
});
exports.redisClient.connect();
exports.redisClient.on('connect', () => {
    logger_1.default.info('Connected to Redis');
});
exports.redisClient.ping().then(() => {
    logger_1.default.info('Ping Response ');
});
exports.default = exports.redisClient;
//# sourceMappingURL=redis.js.map