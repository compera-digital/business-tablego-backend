import { IDbService } from "@/services";
import { ILogger, IResponseHandler } from "@/utils";

export interface IRegisterService {
  register(name: string, email: string, password: string): Promise<any>;
}

export interface IRegisterServiceDependencies {
  dbService: IDbService;
  logger: ILogger;
  responseHandler: IResponseHandler;
}
  