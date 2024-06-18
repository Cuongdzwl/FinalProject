import { reject, resolve } from 'bluebird';
import { OAuth2Strategy } from './oauth2strategy.interface';
import passport from './passport.strategy';
import { NextFunction, Request, Response } from 'express';
import Utils from './utils';
import { UserAccessTokenDTO } from '../../../model/UserDTO';
import L from '../../../common/logger';
export class GoogleAuthentication implements OAuth2Strategy {
  login(req: Request, res: Response, next: NextFunction): any {
    return passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
    })(req, res, next);
  }
  callback(req: Request, res: Response, next: NextFunction): Promise<any> {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'google',
        { session: false },
        (err: any, user: any) => {
          if (err || !user) {
            L.error(err);
            reject({
              ...err,
              metadata: { redirect: '/signup' },
            });
            return;
          }
          const token = Utils.signAccessToken(user.id);
          const refreshtoken = Utils.signRefreshToken(user.id);
          resolve(new UserAccessTokenDTO(user.id, token, refreshtoken)); //
        }
      )(req, res, next);
    });
  }
}

export default new GoogleAuthentication();
