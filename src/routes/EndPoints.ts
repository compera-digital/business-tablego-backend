import { Router } from "express";
import { IEndPoints, IEndPointsDependencies } from "./types";

export class EndPoints implements IEndPoints {
  private readonly router: Router;
  private readonly authController;
  private readonly userController;
  private readonly authMiddleware;

  constructor({ authController, userController, authMiddleware }: IEndPointsDependencies) {
    this.router = Router();
    this.authController = authController;
    this.userController = userController;
    this.authMiddleware = authMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes
    this.router.post("/auth/register", this.authController.register.bind(this.authController));
    this.router.post("/auth/login", this.authController.login.bind(this.authController));
    this.router.post("/auth/verify-code", this.authController.verifyCode.bind(this.authController));
    this.router.post("/auth/resend-code", this.authController.resendCode.bind(this.authController));
    this.router.post("/auth/forgot-password", this.authController.forgotPassword.bind(this.authController));
    this.router.post("/auth/verify-reset-token", this.authController.verifyResetToken.bind(this.authController));
    this.router.post("/auth/reset-password", this.authController.resetPassword.bind(this.authController));
    this.router.post("/user/change-password",
      this.authMiddleware.authenticate,
      this.userController.changePassword.bind(this.userController)
    );
    this.router.post("/auth/check-auth", this.authMiddleware.authenticate);
  }

  public getRouter(): Router {
    return this.router;
  }
}
