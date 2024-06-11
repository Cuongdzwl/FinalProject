import { RoleDTO } from "./RoleDTO";
export declare class UserDTO {
    id?: number;
    username?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class UserInfomationDTO {
    id?: number;
    username?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    role_id?: RoleDTO;
}
export declare class UserAccountDTO {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    constructor(username: string, email: string, password: string);
}
export declare class UserAccessTokenDTO {
    user_id?: number;
    access_token?: string;
    refresh_token?: string;
    constructor(user_id: number, access_token: string, refresh_token: string);
}
