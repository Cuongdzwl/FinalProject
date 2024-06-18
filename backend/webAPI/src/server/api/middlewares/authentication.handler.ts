import { Request, Response, NextFunction } from 'express';
import AuthenticationService from '../services/user/profile/profile.service';
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
        res.status(401).json(new JsonResponse().error("Missing Token.").redirect("/signin").build());
    return;
  }
  try {
    const decoded = await Utils.verifyAccessToken(accessToken);
    const status = await redisClient.get(accessToken)
    if (status === "invalidated") {
      res.status(401).json(new JsonResponse().error("Invalid Token.").redirect("/signin").build());
      return;
    }
    AuthenticationService.getUser(decoded.id).then((r) => {
      if (r) {
        res.locals.user = r;
        l.info(`User authenticated. (id: ${r.id})`);
        next();
      } else {
        res.status(401).json(new JsonResponse().error("User not found.").redirect("/signup").build());
      }
    });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json(new JsonResponse().error("User not found.").metadata({refreshToken: true}).build());
    } else {
      res.status(401).json(new JsonResponse().error("Invalid Token.").redirect("/signin").build());
    }
    return;
  }
};
