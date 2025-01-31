import { PrismaClient } from '@prisma/client';
import { Logger } from '../utils/Logger';

export class DbConnect {
  private static instance: DbConnect;
  private prisma: PrismaClient;
  private readonly logger: Logger;

  private constructor() {
    this.logger = new Logger('DbConnect');
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
  }

  public static getInstance(): DbConnect {
    if (!DbConnect.instance) {
      DbConnect.instance = new DbConnect();
    }
    return DbConnect.instance;
  }

  public async connect(): Promise<void> {
    try {
      this.logger.info('📡 Veritabanına bağlanılıyor...');
      await this.prisma.$connect();
      this.logger.info('✅ PostgreSQL bağlantısı başarılı');
    } catch (error) {
      this.logger.error('❌ Veritabanı bağlantısı başarısız:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      this.logger.info('PostgreSQL bağlantısı başarıyla kapatıldı');
    } catch (error) {
      this.logger.error('PostgreSQL bağlantısı kapatılırken hata oluştu:', error);
      throw error;
    }
  }

  public getPrisma(): PrismaClient {
    return this.prisma;
  }
}

export default DbConnect.getInstance();
