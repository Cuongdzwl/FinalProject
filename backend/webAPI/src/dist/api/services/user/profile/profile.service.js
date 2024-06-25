"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../../../../common/logger"));
const general_service_1 = require("../../general.service");
const prisma = new client_1.PrismaClient();
class ProfileService extends general_service_1.GeneralService {
    all() {
        return new Promise((resolve, _) => {
            logger_1.default.info('Fetching all users from database');
            logger_1.default.info(this.paginationOptions);
            const data = prisma.userInformation
                .findMany({
                select: {
                    id: true,
                    email: true,
                },
                ...this.paginationOptions,
                ...this.orderOptions,
            })
                .catch((_) => {
                return prisma.user.findMany({
                    ...this.paginationOptions,
                });
            });
            return resolve(data);
        });
    }
    getUser(id) {
        return prisma.userInformation.findUnique({
            where: { userId: id },
        });
    }
    getUserRoles(id) {
        return prisma.userRole.findMany({
            select: { role: { select: { id: true, name: true } } },
            where: { userId: id },
        });
    }
    update(id, data) {
        data.userId = undefined;
        if (data.phone) {
            data.phoneverified = false;
        }
        return new Promise((resolve, reject) => {
            prisma.userInformation
                .upsert({
                where: { userId: id },
                update: data,
                create: data,
            })
                .then((r) => {
                if (r) {
                    resolve(r);
                }
                else {
                    reject({ message: 'Empty profile' });
                }
            })
                .catch((err) => {
                logger_1.default.error(err);
                reject({ message: 'Empty profile.' });
            });
        });
    }
    delete() { }
    generateCacheKey(id, custom) {
        if (!id && !custom)
            return 'profiles';
        return `profiles:${id || ''}${custom || ''}`;
    }
}
exports.ProfileService = ProfileService;
exports.default = new ProfileService();
//# sourceMappingURL=profile.service.js.map