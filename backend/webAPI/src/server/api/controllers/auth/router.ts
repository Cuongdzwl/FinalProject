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
  .post('/refresh-token', controller.refreshToken)
  .post('/logout', authenticate, controller.logout)
  .post('/otp/generate', wip)
  .post('/otp/verify', wip)
  .post('/google', wip)
  .post('/google/callback', wip)
  .post('/password/reset/:token', wip)
  .post('/password/forgot', wip);
