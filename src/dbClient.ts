import redis, { RedisClientType } from 'redis';

//let redisClient: RedisClientType;

export const  getRedisClient = ()=> {
    const client = redis.createClient({
      url: process.env.REDIS_URL,
    });
  
    client.on('error', (err) => console.error('Redis Client Error', err));
    client.connect();
  
    return client;
}

