import { Request, Response } from "express";
import { IRegisterService, ILoginService } from "@/services";
import { IResponseHandler, ILogger } from "@/utils";

export interface IAuthController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
}

export interface IAuthControllerDependencies {
  registerService: IRegisterService;
  loginService: ILoginService;
  responseHandler: IResponseHandler;
  logger: ILogger;
}
