import { IAuthenticationService } from './authentication.interface';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserAccessTokenDTO, UserAccountDTO } from '../../../model/UserDTO';
import authenticator from './passport.strategy';
import L from '../../../common/logger';
import Utils from './utils';
import redisClient from '../../../common/redis';
import { JsonWebTokenError } from 'jsonwebtoken';
import { IEmailService } from '../communication/email/email.interface';
import userService from '../user/user.service';
import { reject, resolve } from 'bluebird';

const prisma = new PrismaClient();

const REFRESH_TOKEN_EXPIRATION_SECONDS: number = 7 * 24 * 60 * 60 * 1000; // 7 days
const TOKEN_EXPIRATION_SECONDS: number = 15 * 60; // 15 minutes

export class AuthenticationService implements IAuthenticationService {
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
  private signAccessToken(user: User): string {
    let token = Utils.signAccessToken(user.id);
    return token;
  }
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
  private signRefreshToken(user: User): string {
    let refreshToken = Utils.signRefreshToken(user.id);
    // Save to database
    redisClient.set(refreshToken, user.id.toString(), {
      EX: REFRESH_TOKEN_EXPIRATION_SECONDS,
    });
    return refreshToken;
  }
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
  async refreshTokens(
    refreshToken: string,
    accessToken?: string
  ): Promise<any> {
    try {
      const decoded = Utils.verifyRefreshToken(refreshToken);

      const userid = await redisClient.get(refreshToken);

      if (!userid) {
        return Promise.reject({ message: 'Invalid refresh token' });
      }
      const [newAccessToken, newRefreshToken] = await Promise.all([
        Utils.signAccessToken(decoded.id),
        Utils.signRefreshToken(decoded.id),
      ]);

      redisClient.del(refreshToken);
      if (accessToken) {
        redisClient.set(accessToken, 'invalidated', {
          EX: TOKEN_EXPIRATION_SECONDS,
        });
      }
      redisClient.set(newRefreshToken, userid as string, {
        EX: REFRESH_TOKEN_EXPIRATION_SECONDS,
      });

      return Promise.resolve(
        new UserAccessTokenDTO(decoded.id, newAccessToken, newRefreshToken)
      );
    } catch (error) {
      L.error(error);
      return Promise.reject({
        message: 'Something went wrong! Invalid refresh token',
      });
    }
  }

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
  authenticate(req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      authenticator.authenticate(
        'local',
        { session: false },
        (err: any, user: User, info: any) => {
          if (err) {
            reject(err);
          } else if (!user) {
            reject(info);
          } else {
            const token = this.signAccessToken(user);
            const refreshtoken = this.signRefreshToken(user);
            resolve(new UserAccessTokenDTO(user.id, token, refreshtoken));
          }
        }
      )(req);
    });
  }

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
  async signup(user: UserAccountDTO): Promise<any> {
    if (user.password === undefined) {
      return Promise.reject({ message: 'Password is required' });
    }
    var salt: string = await Utils.generateSalt();
    var hashedPassword: string = await Utils.hashPassword(user.password, salt);
    var payload: any = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      salt: salt,
    };
    return new Promise((resolve, reject) => {
      prisma.user
        .create({
          data: payload,
        })
        .then((user) => {
          L.debug('User created: ' + JSON.stringify(user));
          const token = this.signAccessToken(user);
          const refreshtoken = this.signRefreshToken(user);
          resolve(new UserAccessTokenDTO(user.id, token, refreshtoken));
        })
        .catch((error) => {
          L.error(error);
          reject({ message: 'Something went wrong', error });
        });
    });
  }
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
  logout(accessToken: string, refreshToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // Verify the access token
        if (!Utils.verifyAccessToken(accessToken)) {
          reject({ message: 'Token expired' });
          return;
        }
      } catch (error) {
        // Handle invalid access token
        if (error instanceof JsonWebTokenError) {
          reject({ message: 'Invalid Token' });
          return;
        }
        // Log any other error
        L.error(error);
        reject({ message: 'Something went wrong.' });
        return;
      }
      // Delete the refresh token from Redis
      redisClient.del(refreshToken);
      // Blacklist the access token in Redis
      redisClient.set(accessToken, 'invalidated', {
        EX: TOKEN_EXPIRATION_SECONDS,
      });
      // Resolve with success message
      resolve({ message: 'Logged out.' });
    });
  }
}

export default new AuthenticationService();
