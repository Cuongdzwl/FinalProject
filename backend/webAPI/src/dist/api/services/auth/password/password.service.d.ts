import IPasswordService from './password.interface';
export declare class PasswordService implements IPasswordService {
    createOrUpdateResetPasswordToken(userId: number, token: string): Promise<any>;
    invalidateResetPasswordToken(token: string): Promise<void>;
    generateResetPasswordToken(email: string): Promise<any>;
    resetPassword(token: string, password: string): Promise<any>;
}
declare const _default: PasswordService;
export default _default;
