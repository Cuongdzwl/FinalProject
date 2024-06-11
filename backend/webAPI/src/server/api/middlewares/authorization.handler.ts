import { Request, Response, NextFunction } from 'express';
import AuthenticationService from '../services/auth/authentication.service';
import l from '../../common/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function checkRoles(roles: string[], roleName: string): boolean {
  for (const role of roles) {
    if (role.trim().toUpperCase() === roleName.trim().toUpperCase()) {
      return true;
    }
  }
  return false;
}
export const authorize =
  (roles: string[]) =>
  async (_: Request, res: Response, next: NextFunction) => {
    // Fetch database
    const userRole = await prisma.userRole.findFirst({
      select: { role: true },
      where: { userId: res.locals.user.id as number },
    });
    if (!userRole) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    // TODO: Cache the user role
    if (checkRoles(roles, userRole.role.name || '')) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
