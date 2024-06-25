"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../../../../common/logger"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const user_service_1 = __importDefault(require("../../user/user.service"));
const prisma = new client_1.PrismaClient();
class OTPService {
    getUserAuthentication(userid) {
        return prisma.userAuthentication.findUnique({
            where: {
                userId: userid,
            },
        });
    }
    getUserSecret(userid) {
        logger_1.default.info('fetched user otp secret');
        return new Promise((resolve, reject) => {
            this.getUserAuthentication(userid)
                .then(async (r) => {
                var secret = null;
                if (r == null) {
                    secret = await this.generateSecret(userid);
                    if (!secret) {
                        logger_1.default.error(`Failed to generate secret. (user ${userid})`);
                        reject({ message: 'Failed to generate secret' });
                        return;
                    }
                }
                else {
                    secret = r.OTPKey;
                }
                if (secret == null) {
                    secret = await this.generateSecret(userid);
                    if (!secret) {
                        logger_1.default.error(`Failed to generate secret. (user ${userid})`);
                        reject({ message: 'Failed to generate secret' });
                        return;
                    }
                }
                resolve(secret);
            })
                .catch((error) => {
                logger_1.default.error(error);
                reject(null);
                return;
            });
        });
    }
    createOrUpdateOTPSecret(userid, secret) {
        logger_1.default.info(`Creating new secret for user ${userid}`);
        return prisma.userAuthentication
            .upsert({
            create: {
                userId: userid,
                OTPKey: secret,
            },
            update: {
                OTPKey: secret,
            },
            where: {
                userId: userid,
            },
        })
            .then((r) => {
            return r.OTPKey;
        })
            .catch((err) => {
            logger_1.default.error(err);
            return null;
        });
    }
    createOrUpdateLastVerifiedOTP(userid, otp) {
        logger_1.default.info(`Creating or updating OTP for user ${userid}`);
        return prisma.userAuthentication
            .upsert({
            create: {
                userId: userid,
                LastVerifiedOTP: otp,
            },
            update: {
                LastVerifiedOTP: otp,
            },
            where: {
                userId: userid,
            },
        })
            .then((r) => {
            return r.LastVerifiedOTP;
        })
            .catch((err) => {
            logger_1.default.error(err);
            return null;
        });
    }
    generateOTP(userid) {
        return new Promise(async (resolve, reject) => {
            const user = await prisma.userAuthentication.findUnique({
                where: {
                    userId: userid,
                },
            });
            if (!user) {
                reject({ message: 'User not found' });
                return;
            }
            var secret = user.OTPKey;
            if (!user.OTPKey) {
            }
            logger_1.default.info('secret: ' + secret);
            const otp = speakeasy_1.default.totp({
                secret: secret,
                encoding: 'base32',
                time: 120,
            });
            // No need
            //   await this.createOrUpdateOTP(userid, otp);
            resolve(Number(otp));
        });
    }
    verifyOTP(userid, token) {
        logger_1.default.info(`Verifying OTP for user ${userid}`);
        return new Promise((resolve, reject) => {
            this.getUserAuthentication(userid)
                .then((user) => {
                logger_1.default.info(user);
                if (!user) {
                    reject({ message: 'User not found' });
                    return;
                }
                if (!user.OTPKey) {
                    reject({ message: 'Something went wrong' });
                    return;
                }
                if (user.LastVerifiedOTP == token) {
                    reject({ message: 'OTP already used' });
                    return;
                }
                const verified = speakeasy_1.default.totp.verify({
                    secret: user.OTPKey,
                    encoding: 'base32',
                    token: token,
                    window: 3,
                });
                logger_1.default.info(verified);
                if (!verified) {
                    reject({ message: 'Invalid OTP' });
                    return;
                }
                resolve(verified);
                this.createOrUpdateLastVerifiedOTP(userid, token);
            })
                .catch((error) => {
                logger_1.default.error(error);
                reject({ message: 'Something went wrong' });
                return;
            });
        });
    }
    async generateSecret(userid) {
        logger_1.default.info(`OTP secret for user ${userid} not found.`);
        const secret = speakeasy_1.default.generateSecret({
            length: 32,
            name: `user${userid}`,
            issuer: 'TCPal',
        });
        await this.createOrUpdateOTPSecret(userid, secret.base32);
        return secret.base32;
    }
    async generateQRCode(userid) {
        const secret = await this.getUserSecret(userid);
        const user = await user_service_1.default.byId(userid);
        logger_1.default.info(secret);
        return new Promise((resolve, reject) => {
            if (!user) {
                reject({ message: 'User not found' });
                return;
            }
            if (!secret) {
                reject({ message: 'Failed to generate authentication secret.' });
                return;
            }
            logger_1.default.info(secret);
            const qrpath = speakeasy_1.default.otpauthURL({
                secret: secret,
                label: `${user.email}`,
                issuer: 'TCPal',
                algorithm: 'sha1',
                encoding: 'base32',
            });
            qrcode_1.default.toDataURL(qrpath, (err, url) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(url);
            });
        });
    }
}
exports.OTPService = OTPService;
exports.default = new OTPService();
//# sourceMappingURL=otp.service.js.map