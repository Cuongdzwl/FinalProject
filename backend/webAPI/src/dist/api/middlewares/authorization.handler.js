"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const profile_service_1 = __importDefault(require("./../services/user/profile/profile.service"));
const logger_1 = __importDefault(require("../../common/logger"));
const client_1 = require("@prisma/client");
const utils_1 = require("../common/utils");
const prisma = new client_1.PrismaClient();
function checkRoles(roles, roleName) {
    for (const role of roles) {
        if (role.trim().toLowerCase() === roleName.trim().toLowerCase()) {
            return true;
        }
    }
    return false;
}
const authorize = (roles) => async (_, res, next) => {
    // Fetch database
    var userRole = await profile_service_1.default.getUserRoles(res.locals.user.id)
        .then((r) => {
        return r;
    })
        .catch((err) => {
        logger_1.default.error(err);
        return null;
    });
    logger_1.default.info(userRole);
    if (!userRole) {
        res.status(403).json(new utils_1.JsonResponse().error('Forbidden.').build());
        return;
    }
    // TODO: Cache the user role
    if (checkRoles(roles, userRole.role.name || '')) {
        next();
    }
    else {
        res
            .status(403)
            .json(new utils_1.JsonResponse()
            .error('You do not have not enough permission.')
            .build());
    }
};
exports.authorize = authorize;
//# sourceMappingURL=authorization.handler.js.map