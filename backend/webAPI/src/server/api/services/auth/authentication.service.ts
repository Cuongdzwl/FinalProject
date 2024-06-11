import { IAuthenticationService } from './authentication.interface';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  UserAccessTokenDTO,
  UserAccountDTO,
  UserInfomationDTO,
} from '../../../model/UserDTO';
import { OAuth2Strategy } from './oauth2strategy.interface';
import authenticator from './passport.strategy';
import L from '../../../common/logger';
import Utils from './utils';
import redisClient from '../../../common/redis';
import { JsonWebTokenError } from 'jsonwebtoken';

const prisma = new PrismaClient();
const TOKEN_EXPIRATION_SECONDS: number = 7 * 24 * 60 * 60 * 1000; // 7 days
export class AuthenticationService implements IAuthenticationService {
  private signAccessToken(user: User): string {
    let token = Utils.signAccessToken(user.id);
    return token;
  }
  private signRefreshToken(user: User): string {
    let refreshToken = Utils.signRefreshToken(user.id);
    // Save to database
    redisClient.set(refreshToken, user.id.toString(), {
      EX: TOKEN_EXPIRATION_SECONDS,
    });
    return refreshToken;
  }

  async refreshTokens(refreshToken: string): Promise<any> {
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
      redisClient.set(newRefreshToken, userid as string, {
        EX: TOKEN_EXPIRATION_SECONDS,
      });

      
      return Promise.resolve(
        new UserAccessTokenDTO(decoded.id, newAccessToken, newRefreshToken)
      );
    } catch (error) {
      L.error(error);
      return Promise.reject({ message: 'Something went wrong! Invalid refresh token' });
    }
  }

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
            resolve({ id: user.id, token, refreshtoken });
          }
        }
      )(req);
    });
  }
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
  oauth(_: Request, strategy: OAuth2Strategy): Promise<any> {
    // TODO: Implement this method
    return new Promise(() => {
      strategy.login();
    });
  }
  logout(accessToken: string, refreshToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (!Utils.verifyAccessToken(accessToken)) {
          reject({ message: 'Token expired' });
          return;
        }
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          reject({ message: 'Invalid Token' });
          return;
        }
        L.error(error);
        reject({ message: 'Something went wrong.' });
        return;
      }
      redisClient.del(refreshToken);
      resolve({ message: 'Logged out.' });
    });
  }
  user(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      prisma.user
        .findUnique({ where: { id: id } })
        .then((user) => {
          if (!user) {
            reject({ message: 'User not found.' });
          }
          // TODO: Fix this
          resolve(user as UserInfomationDTO);
        })
        .catch((err) => {
          L.error(err);
          reject({ message: 'User not found.' });
        });
    });
  }
}

export default new AuthenticationService();
