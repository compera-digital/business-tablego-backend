  import { Request, Response } from "express";
  import { IAuthController, IAuthControllerDependencies } from "./types";

  export class AuthController implements IAuthController {
    private readonly logger;
    private readonly responseHandler;
    private readonly registerService;
    private readonly loginService;
    private readonly verificationService;

    constructor({ registerService, loginService, responseHandler, logger, verificationService }: IAuthControllerDependencies) {
      this.registerService = registerService;
      this.loginService = loginService;
      this.responseHandler = responseHandler;
      this.logger = logger;
      this.verificationService = verificationService;
    }

    async register(req: Request, res: Response) {
      const { name, lastName, email, referralCode, password } = req.body;
      try {
        const response = await this.registerService.register(name, lastName, email, referralCode, password);
        res.status(response.status).json(response);
      } catch (error) {
        this.logger.error(`Registration request failed: ${(error as Error).message}`);
        res.status(400).json(this.responseHandler.error((error as Error).message || "Registration process failed"));
      }
    }
    

    async login(req: Request, res: Response) {
      const { email, password } = req.body;
      try {
        const response = await this.loginService.login(email, password);
        res.status(response.status).json(response);
      } catch (error) {
        this.logger.error(`Login attempt failed for user ${email}: ${(error as Error).message}`);
        res.status(500).json(this.responseHandler.unexpectedError("authentication"));
      }
    }

    async verifyCode(req: Request, res: Response) {
      const { email, code } = req.body;
      try {
        const response = await this.verificationService.verifyCode(email, code);
        res.status(response.status).json(response);
      }
      catch (error) {
        this.logger.error(`Verification code verification failed for user ${email}: ${(error as Error).message}`);
        res.status(500).json(this.responseHandler.unexpectedError("verification code verification"));
      }
    }

    async resendCode(req: Request, res: Response) {
      const { email } = req.body;
      try {
        const response = await this.verificationService.resendCode(email);
        res.status(response.status).json(response);
      } catch (error) {
        this.logger.error(`Verification code resending failed for user ${email}: ${(error as Error).message}`);
        res.status(500).json(this.responseHandler.unexpectedError("verification code resending"));
      }
    }
  }
