import { Router, Request, Response } from "express";
import passport from "passport";
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

    // Check Auth endpoint
    this.router.get(
      "/auth/check-auth",
      this.authMiddleware.authenticate,
      (req: Request, res: Response) => {
        res.status(200).json({
          success: true,
          status: 200,
          message: "Authenticated successfully",
          data: {
            user: req.user,
          },
        });
      }
    );

    // Google Auth Routes
    this.router.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    this.router.get(
      "/auth/google/callback",
      passport.authenticate("google", { session: false }),
      this.authController.googleCallback.bind(this.authController)
    );

    // User Routes
    this.router.post(
      "/user/change-password",
      this.authMiddleware.authenticate,
      rateLimits.changePassword,
      this.userController.changePassword.bind(this.userController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
