"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../../../../common/logger"));
const prisma = new client_1.PrismaClient();
class AccountService {
    all() {
        throw new Error('Method not implemented.');
    }
    create() {
        throw new Error('Method not implemented.');
    }
    byId(id) {
        return new Promise((resolve, reject) => {
            prisma.user
                .findUnique({ where: { id: id } })
                .then((r) => {
                if (r)
                    resolve(r);
                else
                    reject({ message: 'User not found.' });
            })
                .catch((err) => {
                logger_1.default.error(err);
                reject({ message: 'User not found.' });
            });
        });
    }
    findBy(_) {
        throw new Error('Method not implemented.');
    }
    update() {
        throw new Error('Method not implemented.');
    }
    delete() {
        throw new Error('Method not implemented.');
    }
}
exports.AccountService = AccountService;
new AccountService();
//# sourceMappingURL=account.service.js.map