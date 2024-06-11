import { Application } from 'express';
import auth from './api/controllers/auth/router'
export default function routes(app: Application): void {
  app.use('/api/v1/auth', auth);
};