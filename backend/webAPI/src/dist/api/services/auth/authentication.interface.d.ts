/// <reference types="cookie-parser" />
import { Request } from "express";
import { UserAccountDTO } from "../../../model/UserDTO";
export interface IAuthenticationService {
    authenticate(req: Request): Promise<any>;
    refreshTokens(refreshToken: string): Promise<any>;
    signup(user: UserAccountDTO): Promise<any>;
    logout(accessToken: string, refreshToken: string): Promise<any>;
}
