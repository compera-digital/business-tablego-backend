import { IMailService } from "@/services/MailService/types";
import { ILogger } from "@/utils/Logger";
import { IRedisClient } from "@/core/infrastructure/redis/types";
import { IHelper } from "@/utils/Helper/types";

export interface IVerificationService {
  generateCode(email: string): Promise<string>;
  verifyCode(email: string, code: string): Promise<boolean>;
  resendCode(email: string): Promise<boolean>;
}

export interface IVerificationServiceDependencies {
  mailService: IMailService;
  redisClient: IRedisClient;
  helper: IHelper;
  codeExpirationTime: number;
  logger: ILogger;
} 