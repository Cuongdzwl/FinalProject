import { PrismaClient, User } from '@prisma/client';
import { IUserService } from './user.interface';
import { UserInformationDTO } from 'server/model/UserDTO';
import L from '../../../common/logger';
import Utils from '../auth/utils';
import { reject, resolve } from 'bluebird';
const prisma = new PrismaClient();

export class UserService implements IUserService {
  all(): Promise<any> {
    L.info('Fetching all users');
    return prisma.user.findMany();
  }
  async update(id: number, data: any): Promise<any> {
    var data: any = { ...data };
    L.info('Updating user with id: ' + id );
    L.info(data);
    if (data.password) {
      const user = await this.byId(id)
        .then((user) => {
          if (!user) return null;
          return user;
        })
        .catch((error) => {
          L.error(error);
          return null;
        });
        data.password = await Utils.hashPassword(data.password, user.salt);
        L.info(data.password)
    }

    return prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    })
  }
  byId(id: number): Promise<any> {
    L.info('Fetching user with id: ' + id);
    return prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
  findBy(field: string, value: string): Promise<any> {
    L.info(`Fetching user with ${field}: ${value}`);
    return prisma.user.findFirst({
      where: {
        [field]: value,
      },
    });
  }

  create(data: any): Promise<any> {
    var user: User = { ...data };
    return new Promise(async (resolve, reject) => {
      try {
        if (user.password) {
          user.salt = await Utils.generateSalt();
          user.password = await Utils.hashPassword(user.password, user.salt);
        }
        prisma.user
          .create({
            data: user,
          })
          .then((r) => {
            resolve(r);
            return;
          })
          .catch((err) => {
            L.error(err);
            reject(err);
            return;
          });
      } catch (err) {
        L.error(err);
        reject(err);
        return;
      }
    });
  }
  delete(id: number): Promise<any> {
    L.info('Deleting user with id:' + id);
    return new Promise((resolve, reject) => {
      prisma.user
        .delete({
          where: {
            id: id,
          },
        })
        .then((r) => {
          resolve(r);
          return;
        })
        .catch((err) => {
          L.error(err);
          reject(err);
          return;
        });
    });
  }
}

export default new UserService();
