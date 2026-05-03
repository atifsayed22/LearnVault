import { Redis } from 'ioredis';

// This connects to your local Redis server
export const redisConnection = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null, // Required for BullMQ
}); 