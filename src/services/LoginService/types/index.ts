import { ILogger, IResponseHandler, IHelper } from "@/utils";
import { IDbService } from "@/services";
import { IRedisClient } from "@/core/infrastructure";

export interface ILoginService {
    login(email: string, password: string): Promise<any>;
    googleLogin(token: string): Promise<any>;
  }

  export interface ILoginServiceDependencies {
    dbService: IDbService;
    redisClient: IRedisClient;
    logger: ILogger;
    responseHandler: IResponseHandler;
    helper: IHelper;
  }