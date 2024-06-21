import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
const SALT_ROUND = 10;

export default class Utils {
  static signAccessToken(userId: number): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
      expiresIn: "5m",
    });
  }

  static signRefreshToken(userId: number): string {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: "7d",
    });
  }

  
  static signResetPasswordToken(userId: number): string {
    return jwt.sign({ id: userId, action: "Reset Password" }, process.env.JWT_RESET_SECRET as string, {
      expiresIn: "5m",
    });
  }

  static verifyAccessToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }
  static verifyResetPasswordToken(token: string): any  {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
    if (!decoded) {
      return null;
    }
    if (decoded.action !== "Reset Password") {
      return null;
    }
    return decoded;
  }

  static verifyRefreshToken(token: string): any {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) ;
  }
  static async generateSalt(rounds: number = 10): Promise<string> {
    return bcrypt.genSalt(rounds);
  }

  static async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  static async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
