import { UserAccountDTO } from './../../../model/UserDTO';
import AuthenticationService from '../../services/auth/authentication.service';
import { Request, Response } from 'express';
import { JsonResponse } from '../../common/utils';
export class AuthController {
  login(req: Request, res: Response): void {
    // email is required
    // password is required
    AuthenticationService.authenticate(req)
      .then((r) => {
        if (r) {
          res.status(200).json(JsonResponse.success(true, r));
        } else {
          res.status(404).json(JsonResponse.error('User not found.'));
        }
      })
      .catch((err) => {
        res.status(401).json(JsonResponse.error(err.message));
      });
  }
  refreshToken(req: Request, res: Response): void {
    var refreshToken: string = req.headers.refresh_token as string;
    var accessToken: string = req.headers.authorization as string;
    AuthenticationService.refreshTokens(refreshToken,accessToken)
      .then((r) => {
        if (r) {
          res.status(200).json(JsonResponse.success(true, r));
        } else {
          res.status(404).json(JsonResponse.error('User not found.'));
        }
      })
      .catch((err) => {
        res.status(401).json(JsonResponse.error(err.message));
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
          res.status(200).json(JsonResponse.success(true, r));
        } else {
          res.status(404).json(JsonResponse.error('User not found.'));
        }
      })
      .catch((err) => {
        res.status(401).json(JsonResponse.error(err.message));
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
          res.status(200).json(JsonResponse.success(true, r));
        } else {
          res.status(404).json(JsonResponse.error('User not found.'));
        }
      })
      .catch((err) => {
        res.status(401).json(JsonResponse.error(err.message));
      });
  }

}

export default new AuthController();
