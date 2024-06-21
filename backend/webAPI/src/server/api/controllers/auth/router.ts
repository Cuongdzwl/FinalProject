import * as express from 'express';
import controller from './controller';
import { authenticate } from '../../middlewares/authentication.handler';
import { authorize } from '../../middlewares/authorization.handler';
import { wip } from '../../middlewares/wip.handler';

export default express
  .Router()
  .get('/', authenticate, authorize, (_: any, res: any) => {
    res.status(200).json({ success: true, message: 'Auth route is working.' });
  })
  .post('/signup', controller.signup)
  .post('/token', controller.login)
  .post('/token/refresh', controller.refreshToken)
  .post('/logout', authenticate, controller.logout)
  .post('/otp/generate',authenticate, controller.getOTP)
  .post('/otp/verify',authenticate, controller.verifyOTP)
  .get('/otp/secret',authenticate, controller.generateOTPQrCode)
  .get('/google', controller.googleAuth)
  .get('/google/callback', controller.googleAuthCallback)
  .post('/password/reset/:token', controller.resetPassword)
  .post('/password/forgot', controller.forgotPassword);
