import { createClient, RedisClientType } from 'redis';
import { createPool, Pool } from 'generic-pool';

let redisPool: Pool<RedisClientType>;
// type any assigned due problems with version of redis
const createRedisClient = ():any => {
    const client = createClient({
        url: process.env.REDIS_URL,
    });

    client.on('error', (err) => console.error('Redis Client Error', err));
    client.connect().catch(console.error);

    return client;
};

export const getRedisPool = (): Pool<RedisClientType> => {
    if (!redisPool) {
        redisPool = createPool({
            create: async () => createRedisClient(),
            destroy: async (client) => client.quit(),
        }, {
            max: 10, // maximum size of the pool
            min: 2,  // minimum size of the pool
        });
    }
    return redisPool;
};

