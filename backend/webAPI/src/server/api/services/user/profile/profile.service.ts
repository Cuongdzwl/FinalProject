import { PrismaClient, User, UserInformation } from '@prisma/client';
import { UserAccountDTO, UserInformationDTO } from '../../../../model/UserDTO';
import L from '../../../../common/logger';
import { IProfileService } from './profile.interface';
import { reject, resolve } from 'bluebird';

const prisma = new PrismaClient();

export class ProfileService implements IProfileService {
  getUser(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      prisma.userInformation
        .findUnique({
          where: { id: id },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dob: true,
            bio: true,

          },
        })
        .then((user) => {
          if (!user) {
            reject({ message: 'User not found.' });
          }
          // TODO: Fix this

          resolve(user as UserAccountDTO);
        })
        .catch((err) => {
          L.error(err);
          reject({ message: 'User not found.' });
        });
    });
  }
  getUserRoles(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      prisma.userRole
        .findMany({
          select: { role: { select: { id: true, name: true } } },
          where: { userId: id },
        })
        .then((r) => {
          if (r) {
            resolve(r);
          } else {
            reject({ message: 'User not found.' });
          }
        })
        .catch((err) => {
          L.error(err);
          reject({ message: 'User not found.' });
        });
    });
  }

  update(id: number, data: UserInformationDTO): Promise<any> {
    if (data.phone) {
      data.phoneverified = false;
    }
    return new Promise((resolve, reject) => {
      prisma.userInformation
        .upsert({
          where: { userId: id },
          update: data,
          create: data,
        })
        .then((r) => {
          if (r) {
            resolve(r);
          } else {
            reject({ message: 'User not found.' });
          }
        })
        .catch((err) => {
          L.error(err);
          reject({ message: 'User not found.' });
        });
    });
  }

  delete() {}


}
export default new ProfileService();
