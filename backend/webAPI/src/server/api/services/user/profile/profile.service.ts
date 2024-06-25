import { PrismaClient, User, UserInformation } from '@prisma/client';
import { UserAccountDTO, UserInformationDTO } from '../../../../model/UserDTO';
import L from '../../../../common/logger';
import { IProfileService } from './profile.interface';
import { reject, resolve } from 'bluebird';
import { GeneralService } from '../../general.service';
import userService from '../user.service';

const prisma = new PrismaClient();

export class ProfileService extends GeneralService implements IProfileService {
  all(): Promise<any> {
    return new Promise<any>((resolve, _) => {
      L.info('Fetching all users from database');
      L.info(this.paginationOptions);
      const data = prisma.userInformation
        .findMany({
          select: {
            id: true,
            email: true,
          },
          ...this.paginationOptions,
          ...this.orderOptions,
        })
        .catch((_) => {
          return prisma.user.findMany({
            ...this.paginationOptions,
          });
        });
      return resolve(data);
    });
  }
  getUser(id: number): Promise<any> {
    return prisma.userInformation.findUnique({
      where: { userId: id },
    });
  }
  getUserRoles(id: number): Promise<any> {
    return prisma.userRole.findMany({
      select: { role: { select: { id: true, name: true } } },
      where: { userId: id },
    });
  }

  update(userId: number, data: UserInformationDTO): Promise<any> {
    data.userId = undefined;
    if (data.phone) {
      data.phoneverified = false;
    }
    return new Promise((resolve, reject) => {
      prisma.userInformation
        .upsert({
          where: { userId: userId },
          update: data,
          create: data,
        })
        .then((r) => {
          if (r) {
            resolve(r);
          } else {
            reject({ message: 'Empty profile' });
          }
        })
        .catch((err) => {
          L.error(err);
          reject({ message: 'Empty profile.' });
        });
    });
  }

  delete() {}

  private async beforeImportProfile(
    userId: number,
    profile: any
  ): Promise<any> {
    const {
      provider,
      sub,
      id,
      displayName,
      given_name,
      family_name,
      email_verified,
      verified,
      email,
      emails,
      picture,
    } = profile;
    L.info('Processing google profile');
    return await prisma.user
      .findUnique({ where: { id: userId }, include: { UserInformation: true } })
      .then((r) => {
        if (!r) return Promise.resolve(null);
        if (!r.UserInformation) {
          return Promise.resolve({
            avatar: picture,
            firstName: given_name,
            lastName: family_name,
            email: email,
            verified: email_verified || verified,
          });
        }
        return Promise.resolve({
          avatar:
            r.UserInformation.avatar === 'https://www.gravatar.com/avatar/'
              ? null
              : r.UserInformation.avatar || picture,
          firstName: r.UserInformation.firstName || given_name,
          lastName: r.UserInformation.lastName || family_name,
          email: r.email || email,
          verified: r.verified || email_verified || verified, // need to consider email is the same with database
        });
      })
      .catch((err) => {
        L.error(err);
        return Promise.resolve(null);
      });
  }

  async importGoogleProfile(userId: number, profile: any): Promise<any> {
    const data = await this.beforeImportProfile(userId, profile);
    if (!data) return Promise.reject({ message: 'Unable to import profile' });
    return new Promise((resolve, reject) => {
      prisma.userInformation
        .upsert({
          where: { userId: userId },
          update: {
            avatar: data.avatar,
            firstName: data.firstName,
            lastName: data.lastName,
          },
          create: {
            userId: userId,
            avatar: data.avatar,
            firstName: data.firstName,
            lastName: data.lastName,
          },
        })
        .then((r) => {
          userService
            .update(userId, { verified: data.verified })
            .catch((err) => {
              L.error(err);
            });
          if (r) {
            resolve(r);
          } else {
            reject({ message: 'Empty profile' });
          }
        })
        .catch((err) => {
          L.error(err);
          reject({ message: 'Empty profile.' });
        });
    });
  }

  generateCacheKey(id: number, custom?: string): string {
    if (!id && !custom) return 'profiles';
    return `profiles:${id || ''}${custom || ''}`;
  }
}
export default new ProfileService();
