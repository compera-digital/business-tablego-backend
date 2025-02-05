import { Router } from "express";
import { IAuthController } from "./types";

export class EndPoints {
  private readonly router: Router;
  private readonly authController: IAuthController;
  

  constructor(authController: IAuthController) {
    this.router = Router();
    this.authController = authController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/auth/login", this.authController.login.bind(this.authController));
    this.router.post("/auth/register", this.authController.register.bind(this.authController));
    this.router.post("/auth/verify-code", this.authController.verifyCode.bind(this.authController));
    this.router.post("/auth/resend-code", this.authController.resendCode.bind(this.authController));
  }

  public getRouter(): Router {
    return this.router;
  }
}
