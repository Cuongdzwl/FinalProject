export default class Utils {
    static signAccessToken(userId: number): string;
    static signRefreshToken(userId: number): string;
    static verifyAccessToken(token: string): any;
    static verifyRefreshToken(token: string): any;
    static generateSalt(rounds?: number): Promise<string>;
    static hashPassword(password: string, salt: string): Promise<string>;
    static validatePassword(password: string, hashedPassword: string): Promise<boolean>;
}
