import { IDbService } from "@/services";
import { ILogger, IResponseHandler, IHelper } from "@/utils";
import { IRedisClient } from "@/core/infrastructure";
import { IMailService } from "@/services/types";

export interface IRegisterService {
  register(name: string, lastName: string, email: string,referralCode: string, password: string): Promise<any>;
}

export interface IRegisterServiceDependencies {
  dbService: IDbService;
  logger: ILogger;
  responseHandler: IResponseHandler;
  redisClient: IRedisClient;
  mailService: IMailService;
  helper: IHelper;
  codeExpirationTime: number;
}
  