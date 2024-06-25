/// <reference types="cookie-parser" />
import { IAuthenticationService } from './authentication.interface';
import { Request } from 'express';
import { UserAccountDTO } from '../../../model/UserDTO';
export declare class AuthenticationService implements IAuthenticationService {
    /**
     * Generates and signs an access token for a user.
     *
     * @param {User} user - The user object for whom the access token is being generated.
     * @returns {string} - The signed access token.
     *
     * @throws Will throw an error if the user object does not contain an 'id' property.
     *
     * @example
     * ```typescript
     * const user = { id: 1, name: 'John Doe', email: 'johndoe@example.com' };
     * const accessToken = signAccessToken(user);
     * console.log(accessToken); // Output: <signed_access_token>
     * ```
     */
    private signAccessToken;
    /**
     * Generates and signs a refresh token for a user.
     * Saves the refresh token to the Redis database with an expiration time.
     *
     * @param {User} user - The user object for whom the refresh token is being generated.
     * @returns {string} - The signed refresh token.
     *
     * @throws Will throw an error if the user object does not contain an 'id' property.
     *
     * @example
     * ```typescript
     * const user = { id: 1, name: 'John Doe', email: 'johndoe@example.com' };
     * const refreshToken = signRefreshToken(user);
     * console.log(refreshToken); // Output: <signed_refresh_token>
     * ```
     */
    private signRefreshToken;
    /**
     * Refreshes the access and refresh tokens for a user.
     *
     * @param {string} refreshToken - The refresh token to be used for token refresh.
     * @param {string} [accessToken] - The current access token (optional).
     * @returns {Promise<any>} - A promise that resolves to a UserAccessTokenDTO object containing the new access and refresh tokens.
     * @throws Will throw an error if the refresh token is invalid or expired.
     *
     * @example
     * ```typescript
     * const refreshToken = '<refresh_token>';
     * const accessToken = '<access_token>';
     * authenticationService.refreshTokens(refreshToken, accessToken)
     *   .then((tokens) => {
     *     console.log(tokens); // Output: UserAccessTokenDTO { userId: 1, accessToken: '<new_access_token>', refreshToken: '<new_refresh_token>' }
     *   })
     *   .catch((error) => {
     *     console.error(error); // Output: { message: 'Invalid refresh token' }
     *   });
     * ```
     */
    refreshTokens(refreshToken: string, accessToken?: string): Promise<any>;
    /**
     * Authenticates a user using the provided request object.
     *
     * @param {Request} req - The request object containing the user's credentials.
     * @returns {Promise<any>} - A promise that resolves to a UserAccessTokenDTO object containing the user's access and refresh tokens.
     * @throws Will reject the promise if there is an error during authentication, or if the user credentials are invalid.
     *
     * @example
     * ```typescript
     * const req = { body: { email: 'johndoe@example.com', password: 'password123' } };
     * authenticationService.authenticate(req)
     *   .then((tokens) => {
     *     console.log(tokens); // Output: UserAccessTokenDTO { userId: 1, accessToken: '<access_token>', refreshToken: '<refresh_token>' }
     *   })
     *   .catch((error) => {
     *     console.error(error); // Output: { message: 'Invalid email or password' }
     *   });
     * ```
     */
    authenticate(req: Request): Promise<any>;
    /**
     * Registers a new user in the system.
     *
     * @param {UserAccountDTO} user - The user object containing the user's name, email, and password.
     * @returns {Promise<any>} - A promise that resolves to a UserAccessTokenDTO object containing the user's access and refresh tokens.
     * @throws Will reject the promise if there is an error during user registration, or if the password is not provided.
     *
     * @example
     * ```typescript
     * const user = { name: 'John Doe', email: 'johndoe@example.com', password: 'password123' };
     * authenticationService.signup(user)
     *   .then((tokens) => {
     *     console.log(tokens); // Output: UserAccessTokenDTO { userId: 1, accessToken: '<access_token>', refreshToken: '<refresh_token>' }
     *   })
     *   .catch((error) => {
     *     console.error(error); // Output: { message: 'Password is required' }
     *   });
     * ```
     */
    signup(user: UserAccountDTO): Promise<any>;
    /**
     * Logs out a user by invalidating the access token and refresh token.
     *
     * @param {string} accessToken - The access token of the user to be logged out.
     * @param {string} refreshToken - The refresh token of the user to be logged out.
     * @returns {Promise<any>} - A promise that resolves to an object with a success message upon successful logout.
     * @throws Will reject the promise if the access token is invalid, expired, or if there is an error during logout.
     *
     * @example
     * ```typescript
     * const accessToken = '<access_token>';
     * const refreshToken = '<refresh_token>';
     * authenticationService.logout(accessToken, refreshToken)
     *   .then((response) => {
     *     console.log(response); // Output: { message: 'Logged out.' }
     *   })
     *   .catch((error) => {
     *     console.error(error); // Output: { message: 'Invalid Token' }
     *   });
     * ```
     */
    logout(accessToken: string, refreshToken: string): Promise<any>;
}
declare const _default: AuthenticationService;
export default _default;
