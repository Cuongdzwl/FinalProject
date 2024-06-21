import { PrismaClient, UserAuthentication } from '@prisma/client';
import L from '../../../../common/logger';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { IOTPService } from './otp.interface';
import { reject, resolve } from 'bluebird';
import userService from '../../user/user.service';

const prisma = new PrismaClient();

export class OTPService implements IOTPService {
  private getUserAuthentication(userid: number): Promise<any> {
    return prisma.userAuthentication.findUnique({
      where: {
        userId: userid,
      },
    });
  }

  private getUserSecret(userid: number): Promise<string> {
    L.info('fetched user otp secret');
    return new Promise((resolve, reject) => {
      this.getUserAuthentication(userid)
        .then(async (r: any) => {
          var secret: string | null = null;
          if (r == null) {
            secret = await this.generateSecret(userid);
            if (!secret) {
              L.error(`Failed to generate secret. (user ${userid})`);
              reject({ message: 'Failed to generate secret' });
              return;
            }
          } else {
            secret = r.OTPKey;
          }
          if (secret == null) {
            secret = await this.generateSecret(userid);
            if (!secret) {
              L.error(`Failed to generate secret. (user ${userid})`);
              reject({ message: 'Failed to generate secret' });
              return;
            }
          }
          resolve(secret);
        })
        .catch((error) => {
          L.error(error);
          reject(null);
          return;
        });
    });
  }

  private createOrUpdateOTPSecret(
    userid: number,
    secret: string
  ): Promise<string | null> {
    L.info(`Creating new secret for user ${userid}`);
    return prisma.userAuthentication
      .upsert({
        create: {
          userId: userid,
          OTPKey: secret,
        },
        update: {
          OTPKey: secret,
        },
        where: {
          userId: userid,
        },
      })
      .then((r) => {
        return r.OTPKey;
      })
      .catch((err) => {
        L.error(err);
        return null;
      });
  }
  private createOrUpdateLastVerifiedOTP(
    userid: number,
    otp: string
  ): Promise<any> {
    L.info(`Creating or updating OTP for user ${userid}`);
    return prisma.userAuthentication
      .upsert({
        create: {
          userId: userid,
          LastVerifiedOTP: otp,
        },
        update: {
          LastVerifiedOTP: otp,
        },
        where: {
          userId: userid,
        },
      })
      .then((r) => {
        return r.LastVerifiedOTP;
      })
      .catch((err) => {
        L.error(err);
        return null;
      });
  }

  generateOTP(userid: number): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      const user = await prisma.userAuthentication.findUnique({
        where: {
          userId: userid,
        },
      });
      if (!user) {
        reject({ message: 'User not found' });
        return;
      }
      var secret: any = user.OTPKey;
      if (!user.OTPKey) {
      }
      L.info('secret: ' + secret);
      const otp = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
        time: 120,
      });
      // No need
      //   await this.createOrUpdateOTP(userid, otp);
      resolve(Number(otp));
    });
  }

  verifyOTP(userid: number, token: string): Promise<any> {
    L.info(`Verifying OTP for user ${userid}`);
    return new Promise<any>((resolve, reject) => {
      this.getUserAuthentication(userid)
        .then((user) => {
          L.info(user);
          if (!user) {
            reject({ message: 'User not found' });
            return;
          }
          if (!user.OTPKey) {
            reject({ message: 'Something went wrong' });
            return;
          }
          if (user.LastVerifiedOTP == token) {
            reject({ message: 'OTP already used' });
            return;
          }
          const verified = speakeasy.totp.verify({
            secret: user.OTPKey,
            encoding: 'base32',
            token: token,
            window: 3,
          });
          L.info(verified);
          if (!verified) {
            reject({ message: 'Invalid OTP' });
            return;
          }
          resolve(verified);
          this.createOrUpdateLastVerifiedOTP(userid, token);
        })
        .catch((error) => {
          L.error(error);
          reject({ message: 'Something went wrong' });
          return;
        });
    });
  }

  async generateSecret(userid: number): Promise<any> {
    L.info(`OTP secret for user ${userid} not found.`);
    const secret = speakeasy.generateSecret({
      length: 32,
      name: `user${userid}`,
      issuer: 'TCPal',
    });
    await this.createOrUpdateOTPSecret(userid, secret.base32);
    return secret.base32;
  }

  async generateQRCode(userid: number): Promise<string> {
    const secret = await this.getUserSecret(userid);
    const user = await userService.byId(userid);
    L.info(secret);
    return new Promise<string>((resolve, reject) => {
      if (!user) {
        reject({ message: 'User not found' });
        return;
      }
      if (!secret) {
        reject({ message: 'Failed to generate authentication secret.' });
        return;
      }
      L.info(secret);
      const qrpath = speakeasy.otpauthURL({
        secret: secret,
        label: `${user.email}`,
        issuer: 'TCPal',
        algorithm: 'sha1',
        encoding: 'base32',
      });
      qrcode.toDataURL(qrpath, (err, url) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(url);
      });
    });
  }
}

export default new OTPService();
