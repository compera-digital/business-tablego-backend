import { ILogger, IResponseHandler } from "@/utils";
import { IDbService } from "@/services";

export interface ILoginService {
    login(email: string, password: string): Promise<any>;
  }

  export interface ILoginServiceDependencies {
    dbService: IDbService;
    logger: ILogger;
    responseHandler: IResponseHandler;
  }