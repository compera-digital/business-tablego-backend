import { Request, Response, Router } from "express";
import { IRegisterService, ILoginService, IVerificationService, IUserService } from "@/services";
import { IResponseHandler, ILogger } from "@/utils";
import { IAuthMiddleware } from "@/middleware/types";

export interface IAuthController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  googleLogin(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  verifyCode(req: Request, res: Response): Promise<void>;
  resendCode(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  verifyResetToken(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  checkAuth(req: Request, res: Response): Promise<void>;
}

export interface IAuthControllerDependencies {
  registerService: IRegisterService;
  loginService: ILoginService;
  responseHandler: IResponseHandler;
  logger: ILogger;
  verificationService: IVerificationService;
  cookieMaxAge: number;
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

