import { Application } from 'express';
import auth from './api/controllers/auth/router'
import profile from './api/controllers/user/profile/router'
import user from './api/controllers/user/router'
import kafka from './api/controllers/kafka/router'

export default function routes(app: Application): void {
  app.get('/api/v1/', (_, res) => {
    res.status(200).json({ status: "success", message: 'API version 1 is ready.' });
  });
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/profile', profile);
  app.use('/api/v1/users', user);
  app.use('/api/v1/kafka', kafka);
};