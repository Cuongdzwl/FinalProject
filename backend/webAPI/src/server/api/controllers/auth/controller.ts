import { UserAccountDTO } from './../../../model/UserDTO';
import AuthenticationService from '../../services/auth/authentication.service';
import { Request, Response, NextFunction } from 'express';
export class AuthController {
  login(req: Request, res: Response): void {
    // email is required
    // password is required
    AuthenticationService.authenticate(req)
      .then((r) => {
        if (r) {
          res.status(200).json(r);
        } else {
          res.status(404).json(r);
        }
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  }
  refreshToken(req: Request, res: Response): void {
    var refreshToken: string = req.headers.refresh_token as string;
    AuthenticationService.refreshTokens(refreshToken)
      .then((r) => {
        if (r) {
          res.status(200).json(r);
        } else {
          res.status(404).json(r);
        }
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  }
  signup(req: Request, res: Response): void {
    // name is required
    // email is required
    // password is required
    var account: UserAccountDTO = req.body;
    AuthenticationService.signup(account)
      .then((r) => {
        if (r) {
          res.status(200).json(r);
        } else {
          res.status(404).json(r);
        }
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  }
  async logout(req: Request, res: Response): Promise<void> {
    var [accessToken, refreshToken] = await Promise.all([
      req.headers.authorization as string,
      req.headers.refresh_token as string,
    ]);

    AuthenticationService.logout(accessToken, refreshToken)
      .then((r) => {
        if (r) {
          res.status(200).json(r);
        } else {
          res.status(404).json(r);
        }
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  }
  async user(_: Request, res: Response, next: NextFunction): Promise<void> {
    AuthenticationService.user(res.locals.user.id as number)
      .then((r) => {
        if (r) {
          next({status : 200, message: 'Access token is valid', data: r});
        } else {
          next({ status: 401, message: "Invalid User" });
        }
      })
      .catch((err) => {
        next({ status: 401, message: err.message });
    });
  }
}

export default new AuthController();
