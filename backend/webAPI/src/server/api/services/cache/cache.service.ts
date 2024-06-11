import redisClient from "../../../common/redis";
export class CacheService {

    set(key: string, value: string, expiration?: number): Promise<void> {
        return new Promise((resolve, reject) => {
            // Set the value in Redis cache
            redisClient.set(key, value,{ EX : (expiration || 60) });
        });
    }

    get(key: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            // Get the value from Redis cache
            redisClient.get(key, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    }

    update(key: string, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
            // Update the value in Redis cache
            redisClient.set(key, value, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

export default new CacheService();