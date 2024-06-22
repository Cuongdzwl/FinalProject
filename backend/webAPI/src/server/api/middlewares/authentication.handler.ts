import { Request, Response, NextFunction } from 'express';
import userService from '../services/user/user.service';
import l from '../../common/logger';
import Utils from '../services/auth/utils';
import { TokenExpiredError } from 'jsonwebtoken';
import { JsonResponse } from '../common/utils';
import cacheService from '../services/cache/cache.service';
import { resolve } from 'bluebird';

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
    const status = await cacheService.get(accessToken)
    // TODO: handle Update user online status

    if (status === "invalidated") {
      res.status(401).json(new JsonResponse().error("Invalid Token.").redirect("/signin").build());
      return;
    }
    l.info("User retrieved successfully." + decoded.id);
    const cache = await cacheService.getData(userService.generateCacheKey(decoded.id))
    if(cache){
      res.locals.user = cache;
      l.info(cache)
      l.info(`User authenticated. Cache (id: ${decoded.id})`);
      next();
      return;
    }
    userService.byId(decoded.id).then((r) => {
      if (r) {
        res.locals.user = r;
        cacheService.cacheData(userService.generateCacheKey(r.id), r)
        l.info(`User authenticated. (id: ${r.id})`);
        next();
      } else {
        res.status(401).json(new JsonResponse().error("Invalid Token.").redirect("/signup").build());
      }
    }).catch((err) => {
      l.error(err);
      res.status(401).json(new JsonResponse().error(err).redirect("/signup").build());
    });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json(new JsonResponse().error("Token expired.").metadata({refreshToken: true}).build());
    } else {
      res.status(401).json(new JsonResponse().error("Invalid Token.").redirect("/signin").build());
    }
    return;
  }
};
