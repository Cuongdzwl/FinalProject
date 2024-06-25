/// <reference types="cookie-parser" />
import { NextFunction, Request, Response } from 'express';
export declare class AuthController {
    login(req: Request, res: Response): void;
    refreshToken(req: Request, res: Response): void;
    signup(req: Request, res: Response): void;
    logout(req: Request, res: Response): Promise<void>;
    googleAuth(req: Request, res: Response, next: NextFunction): void;
    googleAuthCallback(req: Request, res: Response, next: NextFunction): void;
    resetPassword(req: Request, res: Response): void;
    forgotPassword(req: Request, res: Response): void;
    getOTP(_: Request, res: Response): void;
    verifyOTP(req: Request, res: Response): void;
    generateOTPQrCode(_: Request, res: Response): void;
}
declare const _default: AuthController;
export default _default;
