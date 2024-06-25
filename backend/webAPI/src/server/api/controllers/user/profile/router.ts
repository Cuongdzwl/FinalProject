import * as express from 'express';
import controller from './controller';
import { authenticate } from '../../../middlewares/authentication.handler';
import errorHandler from '../../../middlewares/error.handler';
import { authorize } from '../../../middlewares/authorization.handler';
import { wip } from '../../../../api/middlewares/wip.handler';
export default express
  .Router()
  .get('/', authenticate, controller.getUser)
  .put('/', authenticate, controller.updateOrInsert)
  .post('/', authenticate, controller.create)
  .delete('/', authenticate, controller.delete)
  .post('/verify', wip, authenticate, controller.reqVerification)
  .get('/verify/:id', wip, authenticate, controller.checkVerification)
  .get('/verifications/', wip, authenticate, controller.getAllVerifications)
  .post('/verifications/', wip, authenticate, controller.createVerification)
  .get('/verifications/:id', wip, authenticate, controller.getVerification)
  .post('/verifications/:id/verify', wip, authenticate, controller.proceedVerification)
