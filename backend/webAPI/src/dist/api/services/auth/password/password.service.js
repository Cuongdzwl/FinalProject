"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const logger_1 = __importDefault(require("../../../../common/logger"));
const client_1 = require("@prisma/client");
const user_service_1 = __importDefault(require("../../user/user.service"));
const utils_1 = __importDefault(require("../utils"));
const prisma = new client_1.PrismaClient();
class PasswordService {
    createOrUpdateResetPasswordToken(userId, token) {
        logger_1.default.info(`Create or update token for user ${userId}`);
        return prisma.userAuthentication.upsert({
            create: { userId: userId, resetPasswordToken: token },
            update: { resetPasswordToken: token },
            where: { userId: userId },
        });
    }
    invalidateResetPasswordToken(token) {
        logger_1.default.info(`Invalidate token: ${token}`);
        prisma.userAuthentication
            .update({
            where: { resetPasswordToken: token },
            data: { resetPasswordToken: null },
        })
            .catch((err) => {
            logger_1.default.error(err);
        });
        return Promise.resolve();
    }
    generateResetPasswordToken(email) {
        return new Promise((resolve, reject) => {
            user_service_1.default
                .findBy('email', email)
                .then((r) => {
                if (!r)
                    reject({ message: 'User not Found' });
                const token = utils_1.default.signResetPasswordToken(r.id);
                this.createOrUpdateResetPasswordToken(r.id, token)
                    .then((r) => {
                    logger_1.default.info(`Reset token (${r.id}) - User ${r.userId}}: ${token}`);
                    resolve(token);
                })
                    .catch((e) => {
                    logger_1.default.error(e);
                    reject({ message: 'Something went wrong' });
                    return;
                });
            })
                .catch((e) => {
                logger_1.default.error(e);
                reject({ message: 'Something went wrong' });
            });
        });
    }
    async resetPassword(token, password) {
        const userid = await prisma.userAuthentication
            .findFirst({
            where: { resetPasswordToken: token },
        })
            .then((r) => {
            if (!r) {
                return null;
            }
            return r.userId;
        })
            .catch((err) => {
            logger_1.default.error(err);
            return null;
        });
        return new Promise((resolve, reject) => {
            const decoded = utils_1.default.verifyResetPasswordToken(token);
            if (!userid) {
                return reject({ message: 'Invalid Token!' });
            }
            if (!decoded) {
                return reject({ message: 'Invalid Token!' });
            }
            if (decoded.id != userid) {
                return reject({ message: 'Mismatch Token!' });
            }
            user_service_1.default
                .update(decoded.id, { password: password })
                .then((r) => {
                if (r)
                    resolve({ message: 'Password changed' });
                this.invalidateResetPasswordToken(token);
            })
                .catch((e) => {
                logger_1.default.error(e);
                reject({ message: 'Something went wrong' });
                return;
            });
        });
    }
}
exports.PasswordService = PasswordService;
exports.default = new PasswordService();
//# sourceMappingURL=password.service.js.map