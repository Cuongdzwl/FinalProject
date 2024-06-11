import { Request } from "express";
import {UserAccessTokenDTO, UserAccountDTO} from "../../../model/UserDTO";
export interface IAuthenticationService {
    authenticate(req: Request): Promise<any>;
    signup(user: UserAccountDTO): Promise<any>;
    logout(accessToken: string, refreshToken: string): Promise<any>
    user(id: number): Promise<any>;
}