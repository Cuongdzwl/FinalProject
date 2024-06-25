"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authentication_service_1 = __importDefault(require("../../services/auth/authentication.service"));
const google_service_1 = __importDefault(require("../../services/auth/google.service"));
const utils_1 = require("../../common/utils");
const password_service_1 = __importDefault(require("../../services/auth/password/password.service"));
const otp_service_1 = __importDefault(require("../../services/auth/otp/otp.service"));
const logger_1 = __importDefault(require("../../../common/logger"));
class AuthController {
    login(req, res) {
        // email is required
        // password is required
        authentication_service_1.default.authenticate(req)
            .then((r) => {
            if (r) {
                res.status(200).json(new utils_1.JsonResponse().success(r).build());
            }
            else {
                res
                    .status(404)
                    .json(new utils_1.JsonResponse()
                    .error('User not found.')
                    .redirect('/signup')
                    .build());
            }
        })
            .catch((err) => {
            res.status(401).json(new utils_1.JsonResponse().error(err.message).build());
        });
    }
    refreshToken(req, res) {
        var refreshToken = req.headers.refresh_token;
        var accessToken = req.headers.authorization;
        authentication_service_1.default.refreshTokens(refreshToken, accessToken)
            .then((r) => {
            if (r) {
                res.status(200).json(new utils_1.JsonResponse().success(r).build());
            }
            else {
                res
                    .status(404)
                    .json(new utils_1.JsonResponse()
                    .error('User not found.')
                    .redirect('/signup')
                    .build());
            }
        })
            .catch((err) => {
            res.status(401).json(new utils_1.JsonResponse().error(err.message).build());
        });
    }
    signup(req, res) {
        // name is required
        // email is required
        // password is required
        var account = req.body;
        authentication_service_1.default.signup(account)
            .then((r) => {
            if (r) {
                res.status(200).json(new utils_1.JsonResponse().success(r).build());
            }
            else {
                res
                    .status(404)
                    .json(new utils_1.JsonResponse()
                    .error('User not found.')
                    .redirect('/signup')
                    .build());
            }
        })
            .catch((err) => {
            res.status(401).json(new utils_1.JsonResponse().error(err.message).build());
        });
    }
    async logout(req, res) {
        var [accessToken, refreshToken] = await Promise.all([
            req.headers.authorization,
            req.headers.refresh_token,
        ]);
        authentication_service_1.default.logout(accessToken, refreshToken)
            .then((r) => {
            if (r) {
                res.status(200).json(new utils_1.JsonResponse().success(r).build());
            }
            else {
                res
                    .status(404)
                    .json(new utils_1.JsonResponse()
                    .error('User not found.')
                    .redirect('/signup')
                    .build());
            }
        })
            .catch((err) => {
            res.status(401).json(new utils_1.JsonResponse().error(err.message).build());
        });
    }
    googleAuth(req, res, next) {
        google_service_1.default.login(req, res, next);
    }
    googleAuthCallback(req, res, next) {
        google_service_1.default
            .callback(req, res, next)
            .then((r) => {
            if (r)
                res.status(200).json(new utils_1.JsonResponse().success(r).build());
            else
                res
                    .status(404)
                    .json(new utils_1.JsonResponse()
                    .error('User not found.')
                    .redirect('/signup')
                    .build());
        })
            .catch((err) => {
            res
                .status(401)
                .json(new utils_1.JsonResponse().error(err.message).metadata(err.metadata).build());
        });
    }
    resetPassword(req, res) {
        password_service_1.default
            .resetPassword(req.params.token, req.body.password)
            .then((r) => {
            if (r) {
                res.status(200).json(new utils_1.JsonResponse().success(r).build());
            }
            else {
                res
                    .status(404)
                    .json(new utils_1.JsonResponse()
                    .error('User not found.')
                    .redirect('/signup')
                    .build());
            }
        })
            .catch((err) => {
            res.status(401).json(new utils_1.JsonResponse().error(err.message).build());
        });
    }
    forgotPassword(req, res) {
        password_service_1.default
            .generateResetPasswordToken(req.body.email)
            .then((r) => {
            if (r) {
                res
                    .status(200)
                    .json(new utils_1.JsonResponse().success('Password reset link sent.').build());
            }
            else {
                res
                    .status(404)
                    .json(new utils_1.JsonResponse()
                    .error('User not found.')
                    .redirect('/signup')
                    .build());
            }
        })
            .catch((err) => {
            res.status(401).json(new utils_1.JsonResponse().error(err.message).build());
        });
    }
    getOTP(_, res) {
        otp_service_1.default.generateOTP(res.locals.user.id).then((r) => {
            if (r) {
                logger_1.default.info('User successfully generated OTP : ' + JSON.stringify(r));
                res.status(200).json(new utils_1.JsonResponse().success('OTP Sent').build());
            }
            else {
                res
                    .status(404)
                    .json(new utils_1.JsonResponse()
                    .error('User not found.')
                    .redirect('/signup')
                    .build());
            }
        });
    }
    verifyOTP(req, res) {
        const token = req.body.token;
        otp_service_1.default
            .verifyOTP(res.locals.user.id, token)
            .then((r) => {
            if (r) {
                logger_1.default.info('User successfully verified OTP : ' + JSON.stringify(r));
                res
                    .status(200)
                    .json(new utils_1.JsonResponse().success('OTP Verified').build());
            }
            else {
                res
                    .status(404)
                    .json(new utils_1.JsonResponse()
                    .error('User not found.')
                    .redirect('/signup')
                    .build());
            }
        })
            .catch((err) => {
            res.status(401).json(new utils_1.JsonResponse().error(err.message).build());
        });
    }
    generateOTPQrCode(_, res) {
        otp_service_1.default
            .generateQRCode(res.locals.user.id)
            .then((r) => {
            if (r) {
                res
                    .status(200)
                    .json(new utils_1.JsonResponse().success(r).metadata({ qrcode: true }).build());
            }
        })
            .catch((err) => {
            res.status(500)
                .json(new utils_1.JsonResponse().error(err).build());
        });
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=controller.js.map