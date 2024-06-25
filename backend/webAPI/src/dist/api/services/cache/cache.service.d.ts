export declare class CacheService {
    private beta;
    constructor(beta?: number);
    /**
     * Generates a cache key with an optional prefix.
     *
     * @param key - The unique identifier for the cache data.
     * @param prefix - An optional prefix to prepend to the key. If not provided, 'cache:' will be used as the default prefix.
     * @returns A string representing the cache key.
     */
    private generateCacheKey;
    /**
     * Cache Avalance prevention.
     * Generates a random time-to-live (TTL) value for cache entries.
     * The TTL is calculated as the sum of the base TTL and a random factor.
     *
     * @param baseTTL - The base TTL value in seconds.
     * @param addUp - An optional maximum random factor. If not provided, the default value is 60 seconds.
     * @returns The calculated TTL value.
     */
    private getRandomTTL;
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
    getCacheOrDb(key: string, source: () => Promise<any>, prefix?: string): Promise<any>;
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
    cacheData(key: string, data: any, option?: any, jitter?: number): Promise<void>;
    /**
     * Retrieves data from the cache using the provided key and optional prefix.
     * If the data is not found in the cache, it logs a 'Miss cache!' message and returns null.
     *
     * @param key - The unique identifier for the cache data.
     * @param prefix - An optional prefix to prepend to the key. If not provided, the default prefix 'cache:' will be used.
     * @returns A Promise that resolves to the cached data if found, or null if not found.
     * @throws Will throw an error if there is an issue with retrieving the data from the cache.
     */
    getData(key: string, prefix?: string): Promise<any>;
    /**
     * Invalidates the cache for the given key and optional prefix.
     *
     * @param key - The unique identifier for the cache data.
     * @param prefix - An optional prefix to prepend to the key. If not provided, the default prefix 'cache:' will be used.
     *
     * @throws Will throw an error if there is an issue with invalidating the cache.
     */
    invalidateCache(key: string, prefix?: string): Promise<void>;
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
    set(key: string, value: string, option?: any): Promise<string | null>;
    /**
     * Retrieves a value from the Redis cache using the provided key.
     *
     * @param key - The key to retrieve the value from the cache.
     * @returns A Promise that resolves to the value if found, or null if not found.
     *          If an error occurs during the GET operation, the Promise rejects with an error message.
     *
     * @throws Will throw an error if there is an issue with getting the cache.
     */
    get(key: string): Promise<string | null>;
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
    del(key: string): Promise<number>;
}
declare const _default: CacheService;
export default _default;
