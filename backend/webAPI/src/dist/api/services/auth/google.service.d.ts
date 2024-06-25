/// <reference types="cookie-parser" />
import { OAuth2Strategy } from './oauth2strategy.interface';
import { NextFunction, Request, Response } from 'express';
export declare class GoogleAuthentication implements OAuth2Strategy {
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
    login(req: Request, res: Response, next: NextFunction): any;
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
    callback(req: Request, res: Response, next: NextFunction): Promise<any>;
    updateUserProfile(userId: number, profile: any): void;
}
declare const _default: GoogleAuthentication;
export default _default;
