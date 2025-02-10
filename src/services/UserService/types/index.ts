import { IDbService } from "@/services/DbService/types";
import { IResponseHandler, ILogger, IHelper } from "@/utils";

export interface IUserService { 
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<any>;
}

export interface IUserServiceDependencies {
  dbService: IDbService;
  helper: IHelper;
  responseHandler: IResponseHandler;
  logger: ILogger;
}
