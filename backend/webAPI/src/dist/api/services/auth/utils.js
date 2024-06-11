"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUND = 10;
class Utils {
    static signAccessToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: "5m",
        });
    }
    static signRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        });
    }
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
    }
    static async generateSalt(rounds = 10) {
        return bcrypt_1.default.genSalt(rounds);
    }
    static async hashPassword(password, salt) {
        return bcrypt_1.default.hash(password, salt);
    }
    static async validatePassword(password, hashedPassword) {
        return bcrypt_1.default.compare(password, hashedPassword);
    }
}
exports.default = Utils;
//# sourceMappingURL=utils.js.map