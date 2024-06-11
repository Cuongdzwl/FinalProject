/// <reference types="cookie-parser" />
import { IAuthenticationService } from "./authentication.interface";
import { Request } from "express";
import { UserAccountDTO } from "../../../model/UserDTO";
export declare class AuthenticationService implements IAuthenticationService {
    private signAccessToken;
    private signRefreshToken;
    refreshTokens(refreshToken: string): Promise<any>;
    login(req: Request): Promise<any>;
    signup(user: UserAccountDTO): Promise<any>;
    oauth(_: Request, strategy: OAuth2Strategy): Promise<any>;
    logout(_: any): Promise<any>;
    user(): Promise<any>;
}
declare const _default: AuthenticationService;
export default _default;
