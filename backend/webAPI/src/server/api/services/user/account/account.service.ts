import { PrismaClient } from '@prisma/client';
import { IAccountService } from './account.interface';
import L from '../../../../common/logger';

const prisma = new PrismaClient();

export class AccountService implements IAccountService {
  all(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  create(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  byId(id: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      prisma.user
        .findUnique({ where: { id: id } })
        .then((r) => {
          if (r) resolve(r);
          else reject({ message: 'User not found.' });
        })
        .catch((err) => {
          L.error(err);
          reject({ message: 'User not found.' });
        });
    });
  }
  findBy(_: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  update(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  
}

 new AccountService();
