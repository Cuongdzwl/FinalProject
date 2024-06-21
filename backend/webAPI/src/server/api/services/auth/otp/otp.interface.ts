export interface IOTPService {
  generateSecret(userid: number): Promise<string>;
  generateOTP(userid: number): Promise<number>;
  verifyOTP(userid: number, otp: string): Promise<any>;
  generateQRCode(userid: number): Promise<string>;
}
