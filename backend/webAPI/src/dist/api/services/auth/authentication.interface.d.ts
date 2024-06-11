/// <reference types="cookie-parser" />
import { Request } from "express";
import { UserAccountDTO } from "../../../model/UserDTO";
export interface IAuthenticationService {
    login(req: Request): Promise<any>;
    signup(user: UserAccountDTO): Promise<any>;
    logout(token: String): Promise<any>;
    user(token: String): Promise<any>;
}
