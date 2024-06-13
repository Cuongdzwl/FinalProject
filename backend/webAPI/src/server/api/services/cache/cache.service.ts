import redisClient from "../../../common/redis";
export class CacheService {

    set(key: string, value: string, expiration?: number): Promise<void> {
        return new Promise((resolve, reject) => {
            // Set the value in Redis cache
            redisClient.set(key, value,{ EX : (expiration || 60) });
        });
    }


}

export default new CacheService();