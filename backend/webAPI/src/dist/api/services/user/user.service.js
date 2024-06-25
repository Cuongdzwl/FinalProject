"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../../../common/logger"));
const utils_1 = __importDefault(require("../auth/utils"));
const general_service_1 = require("../general.service");
const prisma = new client_1.PrismaClient();
class UserService extends general_service_1.GeneralService {
    /**
     * Fetches all users from the database based on the pagination and order options.
     * If there is an error during the database operation, it will fall back to fetching without pagination options.
     *
     * @returns A Promise that resolves to an array of User objects.
     *
     * @throws Will throw an error if there is a problem with the database connection.
     */
    all() {
        try {
            return new Promise((resolve, _) => {
                logger_1.default.info('Fetching all users from database');
                logger_1.default.info(this.paginationOptions);
                const data = prisma.user
                    .findMany({
                    select: {
                        id: true,
                        email: true,
                    },
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
        finally {
            this.clear();
        }
    }
    /**
     * Counts the number of users based on the provided filter and value.
     * If the result is cached, it will be fetched from the cache instead of the database.
     *
     * @param filter - The field to filter on.
     * @param value - The value to match in the filter field.
     * @returns A Promise that resolves to the count of users.
     *
     * @throws Will throw an error if there is a problem with the database connection or cache retrieval.
     */
    async count(filter, value) {
        try {
            var where = undefined;
            if (filter && value) {
                where = { [filter]: value };
            }
            return prisma.user.count({ where });
        }
        finally {
            this.clear();
        }
    }
    async update(id, data) {
        var data = { ...data };
        logger_1.default.info('Updating user with id: ' + id);
        logger_1.default.info(data);
        if (data.password) {
            const user = await this.byId(id)
                //TODO: Invalidate Cache
                .then((user) => {
                if (!user)
                    return null;
                return user;
            })
                .catch((error) => {
                logger_1.default.error(error);
                return null;
            });
            data.password = await utils_1.default.hashPassword(data.password, user.salt);
        }
        return prisma.user.update({
            where: {
                id: id,
            },
            data: data,
        });
    }
    byId(id) {
        logger_1.default.info('Fetching user with id: ' + id);
        return prisma.user.findUnique({
            where: {
                id: id,
            },
        });
    }
    findBy(field, value) {
        logger_1.default.info(`Fetching user with ${field}: ${value}`);
        return prisma.user.findFirst({
            where: {
                [field]: value,
            },
        });
    }
    create(data) {
        var user = { ...data };
        return new Promise(async (resolve, reject) => {
            try {
                if (user.password) {
                    user.salt = await utils_1.default.generateSalt();
                    user.password = await utils_1.default.hashPassword(user.password, user.salt);
                }
            }
            catch (err) {
                logger_1.default.error(err);
                reject(err);
                return;
            }
            prisma.user
                .create({
                data: user,
            })
                .then((r) => {
                //TODO: Invalidate Cache
                prisma.userRole.create({ data: { userId: r.id, roleId: 7 } });
                resolve(r);
                return;
            })
                .catch((err) => {
                logger_1.default.error(err);
                reject(err);
                return;
            });
        });
    }
    delete(id) {
        logger_1.default.info('Deleting user with id:' + id);
        return new Promise((resolve, reject) => {
            //TODO: Invalidate Cache
            prisma.user
                .delete({
                where: {
                    id: id,
                },
            })
                .then((r) => {
                resolve(r);
                return;
            })
                .catch((err) => {
                logger_1.default.error(err);
                reject(err);
                return;
            });
        });
    }
    generateCacheKey(id, custom) {
        if (!id && !custom)
            return 'users';
        return `users:${id || ''}${custom || ''}`;
    }
}
exports.UserService = UserService;
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map