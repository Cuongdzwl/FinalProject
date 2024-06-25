import ProfileService from './../services/user/profile/profile.service';
import { Request, Response, NextFunction } from 'express';
import l from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { JsonResponse } from '../common/utils';

const prisma = new PrismaClient();

function checkRoles(roles: string[], roleName: string): boolean {
  for (const role of roles) {
    if (role.trim().toLowerCase() === roleName.trim().toLowerCase()) {
      return true;
    }
  }
  return false;
}

export const authorize =
  (roles: string[]) =>
  async (_: Request, res: Response, next: NextFunction) => {
    // Fetch database
    var userRole = await ProfileService.getUserRoles(
      res.locals.user.id as number
    )
      .then((r) => {
        return r;
      })
      .catch((err) => {
        l.error(err);
        return null;
      });
    l.info(userRole);
    if (!userRole) {
      res.status(403).json(new JsonResponse().error('Forbidden.').build());
      return;
    }
    // TODO: Cache the user role
    if (checkRoles(roles, userRole.role.name || '')) {
      next();
    } else {
      res
        .status(403)
        .json(
          new JsonResponse()
            .error('You do not have not enough permission.')
            .build()
        );
    }
  };
