import UserService from './../../services/user/user.service';
import { UserAccountDTO } from './../../../model/UserDTO';
import { Request, Response, NextFunction } from 'express';
import { JsonResponse } from '../../../api/common/utils';
import cacheService from '../../../api/services/cache/cache.service';
import { PrismaClient } from '@prisma/client';
export class UserController {
  cls(_: Request, res: Response): void {
    cacheService.invalidateCache('users');
    res.status(200).json(new JsonResponse().success("ok").build());
  }
  async getUsers(req: Request, res: Response): Promise<void> {
    const page: number = Number(req.query.page);
    const cache = await cacheService.getCacheOrDb(`users(${req.originalUrl})`,() => UserService.all());
    if (cache) {
      res.status(200).json(new JsonResponse().success(cache).build());
      return;
    }else {
      res.status(404).json(new JsonResponse().error(cache).build());
      return
    }
  }
}

export default new UserController();
