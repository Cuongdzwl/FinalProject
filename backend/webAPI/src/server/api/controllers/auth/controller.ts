import { UserAccountDTO } from './../../../model/UserDTO';
import AuthenticationService from '../../services/auth/authentication.service';
import googleService from '../../services/auth/google.service';
import { NextFunction, Request, Response } from 'express';
import { JsonResponse } from '../../common/utils';
import { reject, resolve } from 'bluebird';
import passwordService from '../../services/auth/password/password.service';
import otpService from '../../services/auth/otp/otp.service';
import l from '../../../common/logger';
export class AuthController {
  login(req: Request, res: Response): void {
    // email is required
    // password is required
    AuthenticationService.authenticate(req)
      .then((r) => {
        if (r) {
          res.status(200).json(new JsonResponse().success(r).build());
        } else {
          res
            .status(404)
            .json(
              new JsonResponse()
                .error('User not found.')
                .redirect('/signup')
                .build()
            );
        }
      })
      .catch((err) => {
        res.status(401).json(new JsonResponse().error(err.message).build());
      });
  }
  refreshToken(req: Request, res: Response): void {
    var refreshToken: string = req.headers.refresh_token as string;
    var accessToken: string = req.headers.authorization as string;
    AuthenticationService.refreshTokens(refreshToken, accessToken)
      .then((r) => {
        if (r) {
          res.status(200).json(new JsonResponse().success(r).build());
        } else {
          res
            .status(404)
            .json(
              new JsonResponse()
                .error('User not found.')
                .redirect('/signup')
                .build()
            );
        }
      })
      .catch((err) => {
        res.status(401).json(new JsonResponse().error(err.message).build());
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
          res.status(200).json(new JsonResponse().success(r).build());
        } else {
          res
            .status(404)
            .json(
              new JsonResponse()
                .error('User not found.')
                .redirect('/signup')
                .build()
            );
        }
      })
      .catch((err) => {
        res.status(401).json(new JsonResponse().error(err.message).build());
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
          res.status(200).json(new JsonResponse().success(r).build());
        } else {
          res
            .status(404)
            .json(
              new JsonResponse()
                .error('User not found.')
                .redirect('/signup')
                .build()
            );
        }
      })
      .catch((err) => {
        res.status(401).json(new JsonResponse().error(err.message).build());
      });
  }

  googleAuth(req: Request, res: Response, next: NextFunction): void {
    googleService.login(req, res, next);
  }

  googleAuthCallback(req: Request, res: Response, next: NextFunction): void {
    googleService
      .callback(req, res, next)
      .then((r) => {
        if (r) res.status(200).json(new JsonResponse().success(r).build());
        else
          res
            .status(404)
            .json(
              new JsonResponse()
                .error('User not found.')
                .redirect('/signup')
                .build()
            );
      })
      .catch((err) => {
        res
          .status(401)
          .json(
            new JsonResponse().error(err.message).metadata(err.metadata).build()
          );
      });
  }
  resetPassword(req: Request, res: Response): void {
    passwordService
      .resetPassword(req.params.token, req.body.password)
      .then((r) => {
        if (r) {
          res.status(200).json(new JsonResponse().success(r).build());
        } else {
          res
            .status(404)
            .json(
              new JsonResponse()
                .error('User not found.')
                .redirect('/signup')
                .build()
            );
        }
      })
      .catch((err) => {
        res.status(401).json(new JsonResponse().error(err.message).build());
      });
  }

  forgotPassword(req: Request, res: Response): void {
    passwordService
      .generateResetPasswordToken(req.body.email)
      .then((r) => {
        if (r) {
          res
            .status(200)
            .json(
              new JsonResponse().success('Password reset link sent.').build()
            );
        } else {
          res
            .status(404)
            .json(
              new JsonResponse()
                .error('User not found.')
                .redirect('/signup')
                .build()
            );
        }
      })
      .catch((err) => {
        res.status(401).json(new JsonResponse().error(err.message).build());
      });
  }

  getOTP(_: Request, res: Response): void {
    otpService.generateOTP(res.locals.user.id).then((r) => {
      if (r) {
        l.info('User successfully generated OTP : ' + JSON.stringify(r));
        res.status(200).json(new JsonResponse().success('OTP Sent').build());
      } else {
        res
          .status(404)
          .json(
            new JsonResponse()
              .error('User not found.')
              .redirect('/signup')
              .build()
          );
      }
    });
  }

  verifyOTP(req: Request, res: Response): void {
    const token = req.body.token as string;
    otpService
      .verifyOTP(res.locals.user.id, token)
      .then((r) => {
        if (r) {
          l.info('User successfully verified OTP : ' + JSON.stringify(r));
          res
            .status(200)
            .json(new JsonResponse().success('OTP Verified').build());
        } else {
          res
            .status(404)
            .json(
              new JsonResponse()
                .error('User not found.')
                .redirect('/signup')
                .build()
            );
        }
      })
      .catch((err) => {
        res.status(401).json(new JsonResponse().error(err.message).build());
      });
  }

  generateOTPQrCode(_: Request, res: Response): void {
    otpService
      .generateQRCode(res.locals.user.id)
      .then((r) => {
        if (r) {
          res
            .status(200)
            .json(
              new JsonResponse().success(r).metadata({ qrcode: true }).build()
            );
        }
      })
      .catch((err) => {
        res.status(500)
        .json(
          new JsonResponse().error(err).build()
        );
      });
  }
}

export default new AuthController();
