import { PrismaClient } from '@prisma/client';
import { IDbConnect, IDbConnectDependencies } from './types';

export class DbConnect implements IDbConnect {
  private static instance: DbConnect;
  private prisma;
  private readonly logger;

  private constructor({ logger, databaseUrl }: IDbConnectDependencies) {
    this.logger = logger;
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    });
  }

  public static getInstance(dependencies?: IDbConnectDependencies): DbConnect {
    if (!DbConnect.instance) {
      if (!dependencies) {
        throw new Error('Database connection dependencies required for initialization');
      }
      DbConnect.instance = new DbConnect(dependencies);
    }
    return DbConnect.instance;
  }

  public async connect(): Promise<void> {
    try {
      this.logger.info('Initializing database connection...');
      await this.prisma.$connect();
      this.logger.info('Database connection established successfully');
    } catch (error) {
      this.logger.error('Database connection failed:', error as Error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      this.logger.info('Database connection closed successfully');
    } catch (error) {
      this.logger.error('Failed to close database connection:', error as Error);
      throw error;
    }
  }

  public getPrisma(): PrismaClient {
    return this.prisma;
  }
}

