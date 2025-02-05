// RedisClient.ts

import Redis from 'ioredis';
import { IRedisClient, IRedisClientDependencies } from './types';

export class RedisClient implements IRedisClient {
    private static instance: RedisClient;
    private readonly redis: Redis;
    private readonly logger;

    private constructor({ logger, config }: IRedisClientDependencies) {
        this.logger = logger;
        this.redis = new Redis({
            host: config.host,  
            port: config.port,     
            password: config.password,
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        this.redis.on('error', (error: Error) => {
            this.logger.error('Redis connection error:', error);
        });

        this.redis.on('connect', () => {
            this.logger.info('Redis connection established successfully');
        });
    }

    public static getInstance(dependencies?: IRedisClientDependencies): RedisClient {
        if (!RedisClient.instance) {
            if (!dependencies) {
                throw new Error('Redis client dependencies required for initialization');
            }
            RedisClient.instance = new RedisClient(dependencies);
        }
        return RedisClient.instance;
    }

    public getClient(): Redis {
        return this.redis;
    }

    public async setEx(key: string, seconds: number, value: string): Promise<'OK'> {
        return this.redis.setex(key, seconds, value);
    }

    public async ttl(key: string): Promise<number> {
        return this.redis.ttl(key);
    }

    public async get(key: string): Promise<string | null> {
        return this.redis.get(key);
    }

    public async exists(key: string): Promise<number> {
        return this.redis.exists(key);
    }

    public async del(key: string): Promise<number> {
        return this.redis.del(key);
    }

    public async disconnect(): Promise<void> {
        await this.redis.quit();
        this.logger.info('Redis connection closed successfully');
    }
}
