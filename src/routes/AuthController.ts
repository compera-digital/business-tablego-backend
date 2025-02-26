import { Request, Response } from "express";
import { IAuthController, IAuthControllerDependencies } from "./types";

export class AuthController implements IAuthController {
  private readonly logger;
  private readonly responseHandler;
  private readonly registerService;
  private readonly loginService;
  private readonly verificationService;
  private readonly cookieMaxAge;

  constructor({
    registerService,
    loginService,
    responseHandler,
    logger,
    verificationService,
    cookieMaxAge,
  }: IAuthControllerDependencies) {
    this.registerService = registerService;
    this.loginService = loginService;
    this.responseHandler = responseHandler;
    this.logger = logger;
    this.verificationService = verificationService;
    this.cookieMaxAge = cookieMaxAge;
  }

  async register(req: Request, res: Response) {
    const { name, lastName, email, referralCode, password } = req.body;
    try {
      const response = await this.registerService.register(
        name,
        lastName,
        email,
        referralCode,
        password
      );
      res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Registration request failed: ${(error as Error).message}`
      );
      res
        .status(400)
        .json(
          this.responseHandler.error(
            (error as Error).message || "Registration process failed"
          )
        );
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const response = await this.loginService.login(email, password);
      if (response.success && response.token) {
        res.cookie("accessToken", response.token, {
          httpOnly: true,
          maxAge: this.cookieMaxAge,
        });
      }
      const { token, ...responseData } = response;
      res.status(responseData.status).json(responseData);
    } catch (error) {
      this.logger.error(
        `Login attempt failed for user ${email}: ${(error as Error).message}`
      );
      res
        .status(500)
        .json(this.responseHandler.unexpectedError("authentication"));
    }
  }

  async googleLogin(req: Request, res: Response) {
    const { token } = req.body;
    try {
      const response = await this.loginService.googleLogin(token);
      if (response.success && response.token) {
        res.cookie("accessToken", response.token, {
          httpOnly: true,
          maxAge: this.cookieMaxAge,
        });
      }
      const { token: _, ...responseData } = response;
      res.status(responseData.status).json(responseData);
    } catch (error) {
      this.logger.error(`Google login failed: ${(error as Error).message}`);
      res
        .status(500)
        .json(this.responseHandler.unexpectedError("google authentication"));
    }
  }

  async logout(_req: Request, res: Response) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
      });
      this.logger.info("User logged out successfully");
      res.status(200).json(this.responseHandler.logoutSuccess());
    } catch (error) {
      this.logger.error("Logout failed", error as Error);
      res.status(500).json(this.responseHandler.unexpectedError("logout"));
    }
  }

  async verifyCode(req: Request, res: Response) {
    const { email, code } = req.body;
    try {
      const response = await this.verificationService.verifyCode(email, code);

      if (response.success && response.token) {
        res.cookie("accessToken", response.token, {
          httpOnly: true,
          maxAge: this.cookieMaxAge,
        });
      }

      const { token, ...responseData } = response;
      res.status(responseData.status).json(responseData);
    } catch (error) {
      this.logger.error(
        `Verification code verification failed for user ${email}: ${
          (error as Error).message
        }`
      );
      res
        .status(500)
        .json(
          this.responseHandler.unexpectedError("verification code verification")
        );
    }
  }

  async resendCode(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const response = await this.verificationService.resendCode(email);
      res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Verification code resending failed for user ${email}: ${
          (error as Error).message
        }`
      );
      res
        .status(500)
        .json(
          this.responseHandler.unexpectedError("verification code resending")
        );
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const response = await this.verificationService.forgotPassword(email);
      res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Password reset link request failed: ${(error as Error).message}`
      );
      res
        .status(500)
        .json(this.responseHandler.unexpectedError("password reset"));
    }
  }

  async verifyResetToken(req: Request, res: Response) {
    const { resetToken } = req.body;
    try {
      const response = await this.verificationService.verifyPasswordResetToken(
        resetToken as string
      );
      res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Token verification failed: ${(error as Error).message}`
      );
      res
        .status(500)
        .json(this.responseHandler.unexpectedError("token verification"));
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { resetToken, newPassword } = req.body;
    try {
      const response = await this.verificationService.resetPassword(
        resetToken,
        newPassword
      );
      res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(`Password reset failed: ${(error as Error).message}`);
      res
        .status(500)
        .json(this.responseHandler.unexpectedError("password reset"));
    }
  }

  async checkAuth(req: Request, res: Response) {
    try {
      const response = await this.verificationService.checkAuth(
        req.cookies,
        req.user
      );
      res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Authentication check failed: ${(error as Error).message}`
      );
      res
        .status(500)
        .json(this.responseHandler.unexpectedError("authentication check"));
    }
  }
}
