import * as express from 'express';
import controller from './controller';
import { authenticate } from '../../middlewares/authentication.handler';
import errorHandler from '../../middlewares/error.handler';
import { authorize } from '../../middlewares/authorization.handler';
export default express
  .Router()
  .get('/', controller.getUsers)
  .post('/', controller.createUser)
  .get('/:id', controller.getUser)
  .put('/:id', controller.updateUser)
  .delete('/:id', controller.deleteUser)       
  .get('/clear',authenticate,authorize(["Super Admin"]), controller.cls)
