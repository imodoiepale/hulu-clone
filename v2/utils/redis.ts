// @ts-nocheck

import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | undefined;

export const getRedisClient = async () => {
  if (typeof window === 'undefined') {
    if (!redisClient) {
      redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      redisClient.on('error', err => console.error('Redis Client Error', err));
      await redisClient.connect();
    }
    return redisClient;
  }
  throw new Error('Redis client can only be used on the server side');
};