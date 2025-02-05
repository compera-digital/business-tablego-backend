import { IDbService } from "@/services";
import { ILogger, IResponseHandler } from "@/utils";
import { IVerificationService } from "@/services/types";
import { IRedisClient } from "@/core/infrastructure";

export interface IRegisterService {
  register(name: string, lastName: string, email: string,referralCode: string, password: string): Promise<any>;
}

export interface IRegisterServiceDependencies {
  responseHandler: IResponseHandler;
  verificationService: IVerificationService;
  dbService: IDbService;
  logger: ILogger;
  redisClient: IRedisClient;
}
  