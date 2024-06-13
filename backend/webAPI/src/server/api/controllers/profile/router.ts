import * as express from 'express';
import controller from './controller';
import { authenticate } from '../../middlewares/authentication.handler';
import errorHandler from '../../middlewares/error.handler';
import { authorize } from '../../middlewares/authorization.handler';
export default express
  .Router()
  .get('/', authenticate,authorize(["student"]),controller.getUser)
  .patch('/', authenticate)
  .delete('/', authenticate)
