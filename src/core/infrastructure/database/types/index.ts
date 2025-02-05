import { PrismaClient } from '@prisma/client';
import { ILogger } from '@/utils/types';

export interface IDbConnect {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getPrisma(): PrismaClient;
  }
  
  export interface IDbConnectDependencies {
    logger: ILogger;
    databaseUrl: string;
  }