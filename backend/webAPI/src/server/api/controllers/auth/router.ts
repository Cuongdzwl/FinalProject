import * as express from 'express';
import controller from './controller';
import {authenticate} from '../../middlewares/authentication.handler';
import errorHandler from '../../middlewares/error.handler';
import response from '../../middlewares/response.handler';
import {authorize} from '../../middlewares/authorization.handler';
export default express
  .Router()
  .get('/', authenticate, authorize, (_: any, res: any) => {
    res.status(200).json({ success: true, message: 'Auth route is working.' });
  })
  .post('/signup', controller.signup)
  .post('/token', controller.login)
  .post('/refresh-token', controller.refreshToken)
  .post('/logout', authenticate, controller.logout)
  .get('/user', authenticate, authorize(["admin"]), controller.user, response);
