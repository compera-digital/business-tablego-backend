import { Logger } from '@/utils/Logger';
import Redis from 'ioredis';

export interface IRedisClient {
  getClient(): Redis;
  setEx(key: string, seconds: number, value: string): Promise<'OK'>;
  ttl(key: string): Promise<number>;
  exists(key: string): Promise<number>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<number>;
  disconnect(): Promise<void>;
}

export interface IRedisClientDependencies {
  logger: Logger;
  config: {
    host: string;
    port: number;
    password: string;
  };
} 