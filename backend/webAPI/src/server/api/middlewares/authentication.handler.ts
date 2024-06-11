import { Request, Response, NextFunction } from 'express';
import AuthenticationService from '../services/auth/authentication.service';
import l from '../../common/logger';
import Utils from '../services/auth/utils';
import { TokenExpiredError } from 'jsonwebtoken';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var [accessToken, refreshToken] = await Promise.all([
    req.headers.authorization as string,
    req.headers.refresh_token as string,
  ]);
  if (!accessToken) {
    res.status(401).json({ message: 'Missing token' });
    return;
  }
  try {
    const decoded = await Utils.verifyAccessToken(accessToken);
    AuthenticationService.user(decoded.id).then((r) => {
      if (r) {
        res.locals.user = r;
        l.info(r);
        next();
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
    return;
  }
};
