"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const redis_1 = __importDefault(require("../../../common/redis"));
const logger_1 = __importDefault(require("../../../common/logger"));
const CACHE_TTL = 60; // 60s
class CacheService {
    constructor(beta = 1.0) {
        this.beta = beta;
    }
    /**
     * Generates a cache key with an optional prefix.
     *
     * @param key - The unique identifier for the cache data.
     * @param prefix - An optional prefix to prepend to the key. If not provided, 'cache:' will be used as the default prefix.
     * @returns A string representing the cache key.
     */
    generateCacheKey(key, prefix) {
        if (prefix)
            return prefix + ':' + key;
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
    getRandomTTL(baseTTL, addUp) {
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
    async getCacheOrDb(key, source, prefix) {
        logger_1.default.info(`Fetching data from cache with key: ${key}`);
        try {
            let data = await redis_1.default.get(this.generateCacheKey(key, prefix));
            if (data === null) {
                logger_1.default.info('Miss cache! Create lock and fetch data from source');
                // Implement cache lock to prevent Cache Avanlance
                const lockKey = this.generateCacheKey(key, 'lock');
                const lockValue = Date.now().toString();
                const lockResult = await this.set(lockKey, lockValue, {
                    EX: this.getRandomTTL(10, 5),
                    NX: true,
                });
                if (lockResult === 'OK') {
                    logger_1.default.info('Lock acquired, fetching data from source');
                    // Cache miss, acquire lock and fetch data from the source
                    const sourceData = await source();
                    // Cache the fetched data
                    await this.cacheData(key, sourceData);
                    // Release the lock
                    data = JSON.stringify(sourceData);
                    await redis_1.default.del(lockKey);
                    return sourceData;
                }
                else {
                    // Another process is already fetching the data, wait and retry
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    data = await this.getCacheOrDb(key, source, prefix);
                }
            }
            if (data === null) {
                logger_1.default.info('Data not found');
                return null;
            }
            return await JSON.parse(data);
        }
        catch (err) {
            logger_1.default.error(err);
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
    async cacheData(key, data, option, jitter) {
        try {
            var key = this.generateCacheKey(key);
            if (option) {
                if (option.prefix) {
                    key = this.generateCacheKey(key, option.prefix);
                    option.prefix = undefined;
                }
            }
            jitter = 0;
            await redis_1.default.set(key, JSON.stringify(data), option || { EX: this.getRandomTTL(CACHE_TTL, jitter) });
        }
        catch (err) {
            logger_1.default.error(err);
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
    async getData(key, prefix) {
        try {
            const data = await redis_1.default.get(this.generateCacheKey(key, prefix));
            if (data === null) {
                logger_1.default.info('Miss cache!');
                return null;
            }
            logger_1.default.info(data);
            return JSON.parse(data);
        }
        catch (err) {
            logger_1.default.error(err);
            return null;
        }
    }
    /**
     * Invalidates the cache for the given key and optional prefix.
     *
     * @param key - The unique identifier for the cache data.
     * @param prefix - An optional prefix to prepend to the key. If not provided, the default prefix 'cache:' will be used.
     *
     * @throws Will throw an error if there is an issue with invalidating the cache.
     */
    async invalidateCache(key, prefix) {
        try {
            key = this.generateCacheKey(key, prefix);
            logger_1.default.info(`Invalidating cache for key: ${key}`);
            await redis_1.default.del(key);
        }
        catch (err) {
            logger_1.default.error('Error invalidating cache:', err);
        }
    }
    /**
     * Sets a value in the Redis cache with the specified key and optional options.
     *
     * @param key - The key to store the value in the cache.
     * @param value - The value to be stored in the cache.
     * @param option - An optional object containing additional Redis set options.
     *
     * @returns A Promise that resolves to a string indicating the status of the SET operation.
     *          If the operation is successful, the Promise resolves to 'OK'.
     *          If an error occurs during the SET operation, the Promise rejects with an error message.
     *
     * @throws Will throw an error if there is an issue with setting the cache.
     */
    async set(key, value, option) {
        try {
            return await redis_1.default.set(key, value, option);
        }
        catch (err) {
            logger_1.default.error('Error setting cache:', err);
            return null;
        }
    }
    /**
     * Retrieves a value from the Redis cache using the provided key.
     *
     * @param key - The key to retrieve the value from the cache.
     * @returns A Promise that resolves to the value if found, or null if not found.
     *          If an error occurs during the GET operation, the Promise rejects with an error message.
     *
     * @throws Will throw an error if there is an issue with getting the cache.
     */
    async get(key) {
        try {
            return await redis_1.default.get(key);
        }
        catch (err) {
            logger_1.default.error('Error getting cache:', err);
            return null;
        }
    }
    /**
     * Deletes a value from the Redis cache using the provided key.
     *
     * @param key - The key to delete from the cache.
     *
     * @returns A Promise that resolves to the number of keys deleted.
     *          If the operation is successful, the Promise resolves to 1.
     *          If the key does not exist, the Promise resolves to 0.
     *          If an error occurs during the DEL operation, the Promise rejects with an error message.
     *
     * @throws Will throw an error if there is an issue with deleting the cache.
     */
    async del(key) {
        try {
            return await redis_1.default.del(key);
        }
        catch (err) {
            logger_1.default.error('Error deleting cache:', err);
            throw err; // rethrow the error to propagate it upwards
        }
    }
}
exports.CacheService = CacheService;
exports.default = new CacheService();
//# sourceMappingURL=cache.service.js.map