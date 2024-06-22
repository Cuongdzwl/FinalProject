import L from '../../../../common/logger';
import { PrismaClient } from '@prisma/client';
import userService from '../../user/user.service';
import Utils from '../utils';
import IPasswordService from './password.interface';

const prisma = new PrismaClient();

export class PasswordService implements IPasswordService {
  createOrUpdateResetPasswordToken(
    userId: number,
    token: string
  ): Promise<any> {
    L.info(`Create or update token for user ${userId}`);
    return prisma.userAuthentication.upsert({
      create: { userId: userId, resetPasswordToken: token },
      update: { resetPasswordToken: token },
      where: { userId: userId },
    });
  }

  invalidateResetPasswordToken(token: string): Promise<void> {
    L.info(`Invalidate token: ${token}`);
    prisma.userAuthentication
      .update({
        where: { resetPasswordToken: token },
        data: { resetPasswordToken: null },
      })
      .catch((err) => {
        L.error(err);
      });
    return Promise.resolve();
  }
  generateResetPasswordToken(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      userService
        .findBy('email', email)
        .then((r) => {
          if (!r) reject({ message: 'User not Found' });
          const token = Utils.signResetPasswordToken(r.id);
          this.createOrUpdateResetPasswordToken(r.id, token)
            .then((r) => {
              L.info(`Reset token (${r.id}) - User ${r.userId}}: ${token}`);
              resolve(token);
            })
            .catch((e) => {
              L.error(e);
              reject({ message: 'Something went wrong' });
              return;
            });
        })
        .catch((e) => {
          L.error(e);
          reject({ message: 'Something went wrong' });
        });
    });
  }

  async resetPassword(token: string, password: string): Promise<any> {
    const userid: number | null = await prisma.userAuthentication
      .findFirst({
        where: { resetPasswordToken: token },
      })
      .then((r) => {
        if (!r) {
          return null;
        }
        return r.userId;
      })
      .catch((err) => {
        L.error(err);
        return null;
      });
    return new Promise((resolve, reject) => {
      const decoded = Utils.verifyResetPasswordToken(token);
      if (!userid) {
        return reject({ message: 'Invalid Token!' });
      }
      if (!decoded) {
        return reject({ message: 'Invalid Token!' });
      }
      if (decoded.id != userid) {
        return reject({ message: 'Mismatch Token!' });
      }
      userService
        .update(decoded.id as number, { password: password })
        .then((r) => {
          if (r) resolve({ message: 'Password changed' });
          this.invalidateResetPasswordToken(token);
        })
        .catch((e) => {
          L.error(e);
          reject({ message: 'Something went wrong' });
          return;
        });
    });
  }
}

export default new PasswordService();