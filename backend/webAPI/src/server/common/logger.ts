import pino from 'pino';

const l = pino({
  name: process.env.APP_ID || 'API',
  level: process.env.LOG_LEVEL || 'info',
});

export default l;
