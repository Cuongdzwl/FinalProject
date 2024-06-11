/// <reference types="cookie-parser" />
import { Request, Response } from "express";
export declare class AuthController {
    login(req: Request, res: Response): void;
    logout(_: Request, res: Response): void;
}
declare const _default: AuthController;
export default _default;
