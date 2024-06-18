import { createClient } from 'redis';
import L from './logger';
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://default:password@localhost:6379',
});

redisClient.on('error', (err) => {
  L.error('Redis error:', err);
});
redisClient.connect();

redisClient.on('connect', () => {
  L.info('Connected to Redis');
});

redisClient.ping().then(() => {
  L.info('Ping Response ');
});

export default redisClient;
