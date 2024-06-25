"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const controller_1 = __importDefault(require("./controller"));
const authentication_handler_1 = require("../../middlewares/authentication.handler");
const authorization_handler_1 = require("../../middlewares/authorization.handler");
exports.default = express
    .Router()
    .get('/', authentication_handler_1.authenticate, authorization_handler_1.authorize, (_, res) => {
    res.status(200).json({ success: true, message: 'Auth route is working.' });
})
    .post('/signup', controller_1.default.signup)
    .post('/token', controller_1.default.login)
    .post('/token/refresh', controller_1.default.refreshToken)
    .post('/logout', authentication_handler_1.authenticate, controller_1.default.logout)
    .post('/otp/generate', authentication_handler_1.authenticate, controller_1.default.getOTP)
    .post('/otp/verify', authentication_handler_1.authenticate, controller_1.default.verifyOTP)
    .get('/otp/secret', authentication_handler_1.authenticate, controller_1.default.generateOTPQrCode)
    .get('/google', controller_1.default.googleAuth)
    .get('/google/callback', controller_1.default.googleAuthCallback)
    .post('/password/reset/:token', controller_1.default.resetPassword)
    .post('/password/forgot', controller_1.default.forgotPassword);
//# sourceMappingURL=router.js.map