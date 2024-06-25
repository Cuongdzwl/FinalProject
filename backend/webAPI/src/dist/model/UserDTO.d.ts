export declare class UserDTO {
    id?: number;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class UserInformationDTO {
    userId?: number | null;
    firstName?: string | null;
    lastName?: string | null;
    dob?: Date | null;
    bio?: string | null;
    avatar?: string | null;
    isMale?: boolean | null;
    phone?: string | null;
    phoneverified?: boolean | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    constructor(data: any);
}
export declare class UserAccountDTO {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    constructor(data: any);
}
export declare class UserAccountInfomationDTO {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    constructor(data: any);
}
export declare class UserAccessTokenDTO {
    userId?: number;
    accessToken?: string;
    refreshToken?: string;
    constructor(user_id: number, access_token: string, refresh_token: string);
}
