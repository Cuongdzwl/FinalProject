import { IOTPService } from './otp.interface';
export declare class OTPService implements IOTPService {
    private getUserAuthentication;
    private getUserSecret;
    private createOrUpdateOTPSecret;
    private createOrUpdateLastVerifiedOTP;
    generateOTP(userid: number): Promise<number>;
    verifyOTP(userid: number, token: string): Promise<any>;
    generateSecret(userid: number): Promise<any>;
    generateQRCode(userid: number): Promise<string>;
}
declare const _default: OTPService;
export default _default;
