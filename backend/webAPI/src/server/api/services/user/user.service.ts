import { PrismaClient } from '@prisma/client';
import { IUserService } from './user.interface';
import { UserInformationDTO } from 'server/model/UserDTO';

const prisma = new PrismaClient();

export class UserService implements IUserService {
  update(_: string, __: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  byId(id: number): Promise<any> {
    return prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
  findBy(field: string, value: string): Promise<any> {
    return prisma.user.findFirst({
      where: {
        [field]: value,
      },
    });
  }
  all(): Promise<any> {
    return prisma.user.findMany();
  }
  create(_: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(_: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

export default new UserService();