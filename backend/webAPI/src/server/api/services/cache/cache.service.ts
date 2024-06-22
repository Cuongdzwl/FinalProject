import redis, { redisClient } from '../../../common/redis';
import L from '../../../common/logger';
import { PrismaClient } from '@prisma/client';
const CACHE_TTL = 60 * 60 * 24; // 24 hours

export class CacheService {
  private beta: number;

  constructor(beta: number = 1.0) {
    this.beta = beta;
  }
  /**
   * Generates a cache key with an optional prefix.
   *
   * @param key - The unique identifier for the cache data.
   * @param prefix - An optional prefix to prepend to the key. If not provided, 'cache:' will be used as the default prefix.
   * @returns A string representing the cache key.
   */
  private generateCacheKey(key: string, prefix?: string): string {
    if (prefix) return prefix + ':' + key;
    return `cache:${key}`;
  }

  /**
   * Cache Avalance prevention.
   * Generates a random time-to-live (TTL) value for cache entries.
   * The TTL is calculated as the sum of the base TTL and a random factor.
   *
   * @param baseTTL - The base TTL value in seconds.
   * @param addUp - An optional maximum random factor. If not provided, the default value is 60 seconds.
   * @returns The calculated TTL value.
   */
  private getRandomTTL(baseTTL: number, addUp?: number): number {
    addUp = addUp || 60; // Jitter up to 10 seconds
    const randomFactor = Math.floor(Math.random() * addUp);
    return baseTTL + randomFactor;
  }

  /**
   * Fetches data from the cache with a lock mechanism to prevent cache avalanche.
   * If the data is not found in the cache, it acquires a lock, fetches the data from the source,
   * caches it, and releases the lock. If another process is already fetching the data, it waits and retries.
   *
   * @param key - The unique identifier for the cache data.
   * @param source - A function that fetches the data from the source.
   * @param prefix - An optional prefix to prepend to the cache key. If not provided, 'cache:' will be used as the default prefix.
   * @returns A Promise that resolves to the fetched data.
   */
  async getCacheOrDb(
    key: string,
    source: () => Promise<any>,
    prefix?: string
  ): Promise<any> {
    L.info(`Fetching data from cache with key: ${key}`);
    try {
      let data = await redis.get(this.generateCacheKey(key, prefix));
      if (data === null) {
        L.info('Miss cache! Create lock and fetch data from source');
        // Implement cache lock to prevent Cache Avanlance
        const lockKey = this.generateCacheKey(key, 'lock');
        const lockValue = Date.now().toString();
        const lockResult = await this.set(lockKey, lockValue, {
          EX: this.getRandomTTL(10, 5),
          NX: true,
        });
        if (lockResult === 'OK') {
          L.info('Lock acquired, fetching data from source');
          // Cache miss, acquire lock and fetch data from the source
          const sourceData: any = await source();
          if (!sourceData) return null;
          // Cache the fetched data
          data = JSON.stringify(sourceData);
          await this.cacheData(key, sourceData);
          // Release the lock
          await redis.del(lockKey);
          return sourceData;
        } else {
          // Another process is already fetching the data, wait and retry
          await new Promise((resolve) => setTimeout(resolve, 100));
          data = await this.getCacheOrDb(key, source, prefix);
        }
      }
      if (data === null) {
        L.info('Source invalid, returning null');
        return null;
      }
      return await JSON.parse(data);
    } catch (err) {
      L.error(err);
      return null;
    }
  }


  /**
   * Caches the provided data in Redis with the given key and optional prefix.
   *
   * @param key - The unique identifier for the cache data.
   * @param data - The data to be cached.
   * @param option - An optional object containing additional Redis set options.
   * @param option.prefix - An optional prefix to prepend to the key. If not provided, 'cache:' will be used as the default prefix.
   * @param jitter - An optional parameter to introduce randomness in the cache TTL. If not provided, the default value is 0.
   * @returns A Promise that resolves when the data is successfully cached.
   * @throws Will throw an error if there is an issue with caching the data.
   */
  async cacheData(
    key: string,
    data: any,
    option?: any,
    jitter?: number
  ): Promise<void> {
    try {
      var key = this.generateCacheKey(key);
      if (option) {
        if (option.prefix) {
          key = this.generateCacheKey(key, option.prefix);
          option.prefix = undefined;
        }
      }
      jitter = 0;
      await redis.set(
        key,
        JSON.stringify(data),
        option || { EX: this.getRandomTTL(CACHE_TTL, jitter) }
      );
    } catch (err) {
      L.error(err);
    }
  }
  /**
   * Retrieves data from the cache using the provided key and optional prefix.
   * If the data is not found in the cache, it logs a 'Miss cache!' message and returns null.
   *
   * @param key - The unique identifier for the cache data.
   * @param prefix - An optional prefix to prepend to the key. If not provided, the default prefix 'cache:' will be used.
   * @returns A Promise that resolves to the cached data if found, or null if not found.
   * @throws Will throw an error if there is an issue with retrieving the data from the cache.
   */
  async getData(key: string, prefix?: string): Promise<any> {
    try {
      const data = await redis.get(this.generateCacheKey(key, prefix));
      if (data === null) {
        L.info('Miss cache!');
        return null;
      }
      L.info(data);
      return JSON.parse(data);
    } catch (err) {
      L.error(err);
      return null;
    }
  }

  async invalidateCache(key: string, prefix?: string) {
    try {
      await redis.del(this.generateCacheKey(key, prefix));
    } catch (err) {
      L.error('Error invalidating cache:', err);
    }
  }

  async set(key: string, value: string, option?: any): Promise<string | null> {
    try {
      return await redis.set(key, value, option);
    } catch (err) {
      L.error('Error setting cache:', err);
      return null;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await redis.get(key);
    } catch (err) {
      L.error('Error getting cache:', err);
      return null;
    }
  }
  // Function to check if cache should be refreshed
  private shouldRefreshCache(expiry: number, timeToCompute: number): boolean {
    const currentTime = Date.now();
    const randomLog = Math.log(Math.random());
    return currentTime - timeToCompute * this.beta * randomLog > expiry;
  }

  // Fetch data from cache or database
  // public async getData(key: string, query: () => Promise<any>, ttl = 3600): Promise<any> {
  //   const cacheKey = this.generateCacheKey(key);
  //   try {
  //     const cacheData = await this.get(cacheKey);
  //     const currentTime = Date.now();

  //     if (cacheData) {
  //       const { data, expiry } = JSON.parse(cacheData);
  //       const endTime = process.hrtime();

  //       // Simulate timeToCompute calculation (e.g., from database query)
  //       const timeToCompute = (endTime[0] * 1e9 + endTime[1]) / 1e6;

  //       // Check if we should refresh the cache
  //       if (this.shouldRefreshCache(expiry, timeToCompute)) {
  //         const newStartTime = process.hrtime();
  //         const newData = await query();
  //         const newEndTime = process.hrtime(newStartTime);
  //         const newTimeToCompute = (newEndTime[0] * 1e9 + newEndTime[1]) / 1e6;
  //         const newExpiry = Date.now() + ttl * 1000;

  //         await redisClient.setEx(cacheKey, ttl, JSON.stringify({ data: newData, expiry: newExpiry }));
  //       }

  //       return data;
  //     }

  //     // If cache miss, query database and set cache
  //     const startTime = process.hrtime();
  //     const data = await query();
  //     const endTime = process.hrtime(startTime);
  //     const timeToCompute = (endTime[0] * 1e9 + endTime[1]) / 1e6;
  //     const expiry = Date.now() + ttl * 1000;

  //     await redisClient.setEx(cacheKey, ttl, JSON.stringify({ data, expiry }));
  //     return data;
  //   } catch (err) {
  //     console.error('Cache error:', err);
  //     return query();
  //   }
  // }
}

export default new CacheService();
