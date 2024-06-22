import { reject, resolve } from 'bluebird';
import { OAuth2Strategy } from './oauth2strategy.interface';
import passport from './passport.strategy';
import { NextFunction, Request, Response } from 'express';
import Utils from './utils';
import { UserAccessTokenDTO } from '../../../model/UserDTO';
import L from '../../../common/logger';
export class GoogleAuthentication implements OAuth2Strategy {
  /**
 * Performs the login process using Google OAuth2 strategy.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {any} - Returns the result of the passport.authenticate method.
 *
 * @remarks
 * This method uses the 'google' strategy from Passport.js to authenticate the user.
 * It sets the scope to ['profile', 'email'] and disables session management.
 * The result of the passport.authenticate method is returned.
 *
 * @example
 * ```typescript
 * login(req, res, next);
 * ```
 */
login(req: Request, res: Response, next: NextFunction): any {
  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next);
}
  /**
 * Callback function for handling the Google OAuth2 authentication callback.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {Promise<any>} - A Promise that resolves with a UserAccessTokenDTO object or rejects with an error object.
 *
 * @remarks
 * This method uses the 'google' strategy from Passport.js to authenticate the user.
 * It sets the session to false and handles the callback from Google OAuth2 server.
 * If an error occurs or the user is not authenticated, it rejects the Promise with an error object.
 * If the user is authenticated, it signs an access token and a refresh token using Utils.signAccessToken and Utils.signRefreshToken methods.
 * It then resolves the Promise with a new UserAccessTokenDTO object containing the user ID, access token, and refresh token.
 *
 * @example
 * ```typescript
 * callback(req, res, next).then((userAccessTokenDTO) => {
 *   // Handle successful authentication
 * }).catch((error) => {
 *   // Handle authentication error
 * });
 * ```
 */
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
        resolve(new UserAccessTokenDTO(user.id, token, refreshtoken));
      }
    )(req, res, next);
  });
}
}

export default new GoogleAuthentication();
