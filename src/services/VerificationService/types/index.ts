import { IMailService } from "@/services/MailService/types";
import { IRedisClient } from "@/core/infrastructure/redis/types";
import { ILogger, IHelper, IResponseHandler } from "@/utils";
import { IDbService } from "@/services/DbService/types";

export interface IVerificationService {
  generateCode(email: string): Promise<string>;
  verifyCode(email: string, code: string): Promise<any>;
  resendCode(email: string): Promise<any>;
  forgotPassword(email: string): Promise<any>;
  verifyPasswordResetToken(token: string): Promise<any>;
  resetPassword(token: string, newPassword: string): Promise<any>;
  checkAuth(cookies: { accessToken?: string }): Promise<any>;
}

export interface IVerificationServiceDependencies {
  mailService: IMailService;
  redisClient: IRedisClient;
  dbService: IDbService;
  helper: IHelper;
  logger: ILogger;
  responseHandler: IResponseHandler;
  codeExpirationTime: number;
}
