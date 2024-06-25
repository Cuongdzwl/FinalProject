"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const user_service_1 = __importDefault(require("../services/user/user.service"));
const logger_1 = __importDefault(require("../../common/logger"));
const utils_1 = __importDefault(require("../services/auth/utils"));
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_2 = require("../common/utils");
const cache_service_1 = __importDefault(require("../services/cache/cache.service"));
const authenticate = async (req, res, next) => {
    var [accessToken, refreshToken] = await Promise.all([
        req.headers.authorization,
        req.headers.refresh_token,
    ]);
    if (!accessToken) {
        res.status(401).json(new utils_2.JsonResponse().error("Missing Token.").redirect("/signin").build());
        return;
    }
    try {
        const decoded = await utils_1.default.verifyAccessToken(accessToken);
        const status = await cache_service_1.default.get(accessToken);
        // TODO: handle Update user online status
        if (status === "invalidated") {
            res.status(401).json(new utils_2.JsonResponse().error("Invalid Token.").redirect("/signin").build());
            return;
        }
        logger_1.default.info("User retrieved successfully." + decoded.id);
        const cache = await cache_service_1.default.getData(user_service_1.default.generateCacheKey(decoded.id));
        if (cache) {
            res.locals.user = cache;
            logger_1.default.info(cache);
            logger_1.default.info(`User authenticated. Cache (id: ${decoded.id})`);
            next();
            return;
        }
        user_service_1.default.byId(decoded.id).then((r) => {
            if (r) {
                res.locals.user = r;
                cache_service_1.default.cacheData(user_service_1.default.generateCacheKey(r.id), r);
                logger_1.default.info(`User authenticated. (id: ${r.id})`);
                next();
            }
            else {
                res.status(401).json(new utils_2.JsonResponse().error("Invalid Token.").redirect("/signup").build());
            }
        }).catch((err) => {
            logger_1.default.error(err);
            res.status(401).json(new utils_2.JsonResponse().error(err).redirect("/signup").build());
        });
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(401).json(new utils_2.JsonResponse().error("Token expired.").metadata({ refreshToken: true }).build());
        }
        else {
            res.status(401).json(new utils_2.JsonResponse().error("Invalid Token.").redirect("/signin").build());
        }
        return;
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authentication.handler.js.map