import { Request, Response, NextFunction } from 'express';
import AuthenticationService from '../services/profile/profile.service';
import l from '../../common/logger';
import Utils from '../services/auth/utils';
import { TokenExpiredError } from 'jsonwebtoken';
import { redisClient } from '../../common/redis';
import { JsonResponse } from '../common/utils';

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
    res.status(401).json(JsonResponse.error('Missing token.'));
    return;
  }
  try {
    const decoded = await Utils.verifyAccessToken(accessToken);
    const status = await redisClient.get(accessToken)
    if (status === "invalidated") {
      res.status(401).json(JsonResponse.error('Invalid token.'));
      return;
    }
    AuthenticationService.getUser(decoded.id).then((r) => {
      if (r) {
        res.locals.user = r;
        l.info(`User authenticated. (id: ${r.id})`);
        next();
      } else {
        res.status(404).json(JsonResponse.error('User not found.'));
      }
    });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json(JsonResponse.error('Token expired.',{refreshToken: true}));
    } else {
      res.status(401).json(JsonResponse.error('Invalid token.'));
    }
    return;
  }
};
