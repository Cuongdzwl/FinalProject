"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../../../../common/logger"));
const library_1 = require("@prisma/client/runtime/library");
const prisma = new client_1.PrismaClient();
class ProviderService {
    update(__, _) {
        throw new Error('Method not implemented.');
    }
    byId(id) {
        return prisma.user.findUnique({
            where: {
                id: id,
            },
        });
    }
    findBy(field, value) {
        return prisma.user.findFirst({
            where: {
                [field]: value,
            },
        });
    }
    async getUserProviders(userid, provider) {
        var p = undefined;
        if (provider) {
            p = {
                providerId: await this.getAuthenticationProviderId(provider),
            };
        }
        return prisma.userProvider.findMany({
            select: {
                id: true,
                providerId: true,
                provider: { select: { id: true, name: true } },
            },
            where: { userId: userid, ...p },
        });
    }
    createAuthenticationProvider(name) {
        return prisma.authenticationProvider.create({
            data: {
                name: name.toLowerCase(),
                nameNormalize: name.toUpperCase(),
            },
        });
    }
    getAuthenticationProviderId(name) {
        return prisma.authenticationProvider
            .findUniqueOrThrow({ where: { nameNormalize: name.toUpperCase() } })
            .then((r) => {
            return Promise.resolve(r.id);
        })
            .catch(async (_) => {
            logger_1.default.error('Unable to find provider, creating new one...');
            let r = await this.createAuthenticationProvider(name).catch(async (err) => {
                logger_1.default.error(err);
                return null;
            });
            if (r === null)
                return Promise.reject(null);
            return Promise.resolve(r.id);
        });
    }
    async create(userid, provider, key) {
        var providerId = await this.getAuthenticationProviderId(provider)
            .then((r) => {
            return Promise.resolve(r);
        })
            .catch(async (err) => {
            logger_1.default.error(err);
            return Promise.resolve(null);
        });
        return new Promise((resolve, reject) => {
            if (providerId === null) {
                reject({ message: 'Unable to add provider 1' });
                return;
            }
            prisma.userProvider
                .upsert({
                create: { userId: userid, providerId: providerId, key: key },
                update: { providerId: providerId, key: key },
                where: { userId_providerId: { userId: userid, providerId: providerId } },
            })
                .then((_) => resolve({ message: 'Provider added successfully' }))
                .catch((err) => {
                if (err instanceof library_1.PrismaClientKnownRequestError) {
                    reject({ message: 'Unable to add provider 2' });
                    return;
                }
                logger_1.default.error(err);
            });
        });
    }
    delete(_) {
        throw new Error('Method not implemented.');
    }
}
exports.ProviderService = ProviderService;
exports.default = new ProviderService();
//# sourceMappingURL=provider.service.js.map