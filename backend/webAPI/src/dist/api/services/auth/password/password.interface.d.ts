export default interface IPasswordService {
    createOrUpdateResetPasswordToken(userId: number, token: string): Promise<any>;
    invalidateResetPasswordToken(token: string): Promise<void>;
    generateResetPasswordToken(email: string): Promise<any>;
    resetPassword(token: string, password: string): Promise<any>;
}
