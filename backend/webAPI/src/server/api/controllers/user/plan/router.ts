import * as express from 'express';
import controller from './controller';
import { authenticate } from '../../../middlewares/authentication.handler';
import errorHandler from '../../../middlewares/error.handler';
import { authorize } from '../../../middlewares/authorization.handler';
export default express
    .Router()
    .get('/', controller.getPlans)
    .get('/user', controller.getUserPlans)
    .get('/user/:id', controller.getUserPlan)
    .post('/use/subscribe', controller.subscribePlan)
    .put('/user/:id/plan/:planId',controller.updateUserPlan)
    .delete('/user/:id/plan/:planId',controller.deleteUserPlan);  
