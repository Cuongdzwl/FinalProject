"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const passport_strategy_1 = __importDefault(require("./passport.strategy"));
const logger_1 = __importDefault(require("../../../common/logger"));
const client_1 = require("@prisma/client");
const utils_1 = __importDefault(require("./utils"));
const UserDTO_1 = require("../../../model/UserDTO");
const prisma = new client_1.PrismaClient();
class AuthenticationService {
    signAccessToken(user) {
        let token = utils_1.default.signAccessToken(user.id);
        return token;
    }
    signRefreshToken(user, token) {
        let refresh_token = utils_1.default.signRefreshToken(user.id);
        let createdAt = new Date();
        var payload = {
            userId: user.id,
            refresh_token: refresh_token,
            createdAt: createdAt,
            expiresAt: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
        };
        // Save to database
        prisma.userToken
            .upsert({
            update: payload,
            create: payload,
            where: {
                userId: user.id,
                access_token: token,
            },
        })
            .then((token) => {
            logger_1.default.debug("Token saved to database: " + JSON.stringify(token));
        })
            .catch((error) => {
            logger_1.default.error(error);
        });
        return refresh_token;
    }
    async refreshTokens(refreshToken) {
        try {
            const decoded = utils_1.default.verifyRefreshToken(refreshToken);
            const existingToken = await prisma.userToken.findUnique({
                where: { refresh_token: refreshToken },
            });
            if (!existingToken) {
                return Promise.reject({ message: "Invalid refresh token" });
            }
            const [newAccessToken, newRefreshToken] = await Promise.all([utils_1.default.signAccessToken(decoded.id), utils_1.default.signRefreshToken(decoded.id)]);
            await prisma.userToken.update({
                where: { refresh_token: refreshToken },
                data: { refresh_token: newRefreshToken },
            });
            return Promise.resolve(new UserDTO_1.UserAccessTokenDTO(decoded.id, newAccessToken, newRefreshToken));
        }
        catch (error) {
            logger_1.default.error(error);
            return Promise.reject({ message: "Invalid refresh token" });
        }
    }
    login(req) {
        return new Promise((resolve, reject) => {
            passport_strategy_1.default.authenticate("local", { session: false }, (err, user, info) => {
                if (err) {
                    reject(err);
                }
                else if (!user) {
                    reject(info);
                }
                else {
                    const token = this.signAccessToken(user);
                    const refreshtoken = this.signRefreshToken(user, token);
                    resolve({ id: user.id, token, refreshtoken });
                }
            })(req);
        });
    }
    async signup(user) {
        if (user.password === undefined) {
            return Promise.reject({ message: "Password is required" });
        }
        var salt = await utils_1.default.generateSalt();
        var hashedPassword = await utils_1.default.hashPassword(user.password, salt);
        var payload = {
            name: user.username,
            email: user.email,
            password: hashedPassword,
            salt: salt,
        };
        return new Promise((resolve, reject) => {
            prisma.user
                .create({
                data: payload,
            })
                .then((user) => {
                logger_1.default.debug("User created: " + JSON.stringify(user));
                const token = this.signAccessToken(user);
                const refreshtoken = this.signRefreshToken(user, token);
                resolve(new UserDTO_1.UserAccessTokenDTO(user.id, token, refreshtoken));
            })
                .catch((error) => {
                logger_1.default.error(error);
                reject({ message: "Something went wrong", error });
            });
        });
    }
    oauth(_, strategy) {
        // TODO: Implement this method
        return new Promise(() => {
            strategy.login();
        });
    }
    logout(_) {
        throw new Error("Method not implemented.");
    }
    user() {
        throw new Error("Method not implemented.");
    }
}
exports.AuthenticationService = AuthenticationService;
exports.default = new AuthenticationService();
//# sourceMappingURL=authentication.service.js.map