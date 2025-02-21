import { Request, Response, Router } from "express";
import {
  IRegisterService,
  ILoginService,
  IVerificationService,
  IUserService,
} from "@/services";
import { IResponseHandler, ILogger } from "@/utils";
import { IAuthMiddleware } from "@/middleware/types";
import { IHelper } from "@/utils/types";

export interface IAuthController {
  register(req: Request, res: Response): Promise<any>;
  login(req: Request, res: Response): Promise<any>;
  verifyCode(req: Request, res: Response): Promise<any>;
  resendCode(req: Request, res: Response): Promise<any>;
  forgotPassword(req: Request, res: Response): Promise<any>;
  verifyResetToken(req: Request, res: Response): Promise<any>;
  resetPassword(req: Request, res: Response): Promise<any>;
  googleCallback(req: Request, res: Response): Promise<any>;
}

export interface IAuthControllerDependencies {
  registerService: IRegisterService;
  loginService: ILoginService;
  responseHandler: IResponseHandler;
  logger: ILogger;
  verificationService: IVerificationService;
  cookieMaxAge: number;
  helper: IHelper;
}

export interface IUserController {
  changePassword(req: Request, res: Response): Promise<void>;
}

export interface IUserControllerDependencies {
  responseHandler: IResponseHandler;
  logger: ILogger;
  userService: IUserService;
}

export interface IEndPoints {
  getRouter(): Router;
}

export interface IEndPointsDependencies {
  authController: IAuthController;
  userController: IUserController;
  authMiddleware: IAuthMiddleware;
}
