import { Router } from "express";
import { IEndPoints, IEndPointsDependencies } from "./types";
import { rateLimits } from "../config/rateLimit";

export class EndPoints implements IEndPoints {
  private readonly router: Router;
  private readonly authController;
  private readonly userController;
  private readonly authMiddleware;

  constructor({
    authController,
    userController,
    authMiddleware,
  }: IEndPointsDependencies) {
    this.router = Router();
    this.authController = authController;
    this.userController = userController;
    this.authMiddleware = authMiddleware;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Auth Routes
    this.router.post(
      "/auth/register",
      rateLimits.register,
      this.authController.register.bind(this.authController)
    );

    this.router.post(
      "/auth/login",
      rateLimits.login,
      this.authController.login.bind(this.authController)
    );

    this.router.post(
      "/auth/googleLogin",
      rateLimits.login,
      this.authController.googleLogin.bind(this.authController)
    );

    this.router.post(
      "/auth/logout",
      this.authMiddleware.authenticate,
      this.authController.logout.bind(this.authController)
    );

    this.router.post(
      "/auth/verify-code",
      rateLimits.verifyCode,
      this.authController.verifyCode.bind(this.authController)
    );

    this.router.post(
      "/auth/resend-code",
      rateLimits.resendCode,
      this.authController.resendCode.bind(this.authController)
    );

    this.router.post(
      "/auth/forgot-password",
      rateLimits.forgotPassword,
      this.authController.forgotPassword.bind(this.authController)
    );

    this.router.post(
      "/auth/verify-reset-token",
      rateLimits.verifyResetToken,
      this.authController.verifyResetToken.bind(this.authController)
    );

    this.router.post(
      "/auth/reset-password",
      rateLimits.resetPassword,
      this.authController.resetPassword.bind(this.authController)
    );

    this.router.get(
      "/auth/check-auth",
      this.authController.checkAuth.bind(this.authController)
    );

    // User Routes
    this.router.post(
      "/user/change-password",
      rateLimits.changePassword,
      this.authMiddleware.authenticate,
      this.userController.changePassword.bind(this.userController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
