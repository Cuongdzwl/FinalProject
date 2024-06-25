import { Pagination } from './../../common/utils';
import { PrismaClient, User } from '@prisma/client';
import { IUserService } from './user.interface';
import { UserInformationDTO } from 'server/model/UserDTO';
import L from '../../../common/logger';
import Utils from '../auth/utils';
import { reject, resolve } from 'bluebird';
import cacheService from '../cache/cache.service';
import redisClient from '../../../common/redis';
import { GeneralService } from '../general.service';
const prisma = new PrismaClient();

export class UserService extends GeneralService implements IUserService {
  /**
   * Fetches all users from the database based on the pagination and order options.
   * If there is an error during the database operation, it will fall back to fetching without pagination options.
   *
   * @returns A Promise that resolves to an array of User objects.
   *
   * @throws Will throw an error if there is a problem with the database connection.
   */
  all(): Promise<any> {
    try {
      return new Promise<any>((resolve, _) => {
        L.info('Fetching all users from database');
        L.info(this.paginationOptions);
        const data = prisma.user
          .findMany({
            select: {
              id: true,
              email: true,
            },
            ...this.orderOptions,
          })
          .catch((_) => {
            return prisma.user.findMany({
              ...this.paginationOptions,
            });
          });
        return resolve(data);
      });
    } finally {
      this.clear();
    }
  }
  /**
   * Counts the number of users based on the provided filter and value.
   * If the result is cached, it will be fetched from the cache instead of the database.
   *
   * @param filter - The field to filter on.
   * @param value - The value to match in the filter field.
   * @returns A Promise that resolves to the count of users.
   *
   * @throws Will throw an error if there is a problem with the database connection or cache retrieval.
   */
  async count(filter?: string, value?: string): Promise<any> {
    try {
      var where: any = undefined;
      if (filter && value) {
        where = { [filter]: value };
      }
      return prisma.user.count({ where });
    } finally {
      this.clear();
    }
  }
  async update(id: number, data: any): Promise<any> {
    var data: any = { ...data };
    L.info('Updating user with id: ' + id);
    L.info(data);
    if (data.password) {
      const user = await this.byId(id)
        //TODO: Invalidate Cache
        .then((user) => {
          if (!user) return null;
          return user;
        })
        .catch((error) => {
          L.error(error);
          return null;
        });
      data.password = await Utils.hashPassword(data.password, user.salt);
    }

    return prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });
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
      } catch (err) {
        L.error(err);
        reject(err);
        return;
      }
      prisma.user
        .create({
          data: user,
        })
        .then((r) => {
          //TODO: Invalidate Cache
          prisma.userRole.create({ data: { userId: r.id, roleId: 7 } });
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
  delete(id: number): Promise<any> {
    L.info('Deleting user with id:' + id);
    return new Promise((resolve, reject) => {
      //TODO: Invalidate Cache
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

  generateCacheKey(id?: number, custom?: string): string {
    if (!id && !custom) return 'users';
    return `users:${id || ''}${custom || ''}`;
  }
}

export default new UserService();
