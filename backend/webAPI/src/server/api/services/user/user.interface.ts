import { User } from '@prisma/client';
import { UserInformationDTO } from 'server/model/UserDTO';

export interface IUserService {
  all(): Promise<any>;
  byId(id: number): Promise<any>;
  findBy(field: string, value: string): Promise<any>;
  create(user: any): Promise<any>;
  update(id: string, user: any): Promise<any>;
  delete(id: string): Promise<any>;
}
