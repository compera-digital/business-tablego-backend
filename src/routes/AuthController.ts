  import { Request, Response } from "express";
  import { IAuthController, IAuthControllerDependencies } from "./types";

  export class AuthController implements IAuthController {
    private readonly logger;
    private readonly responseHandler;
    private readonly registerService;
    private readonly loginService;

    constructor({ registerService, loginService, responseHandler, logger }: IAuthControllerDependencies) {
      this.registerService = registerService;
      this.loginService = loginService;
      this.responseHandler = responseHandler;
      this.logger = logger;
    }

    async register(req: Request, res: Response) {
      const { name, email, password } = req.body;
      try {
        const user = await this.registerService.register(name, email, password);
        res.status(201).json(this.responseHandler.registrationSuccess(user.id, user.email));
      } catch (error) {
        this.logger.error("Registration failed", error as Error);
        res.status(400).json(this.responseHandler.error((error as Error).message || "Registration process failed"));
      }
    }
    

    async login(req: Request, res: Response) {
      const { email, password } = req.body;
      try {
        const response = await this.loginService.login(email, password);

        res.status(response.status).json(response);
      } catch (error) {
        this.logger.error("Login failed", error as Error);
        res.status(500).json(this.responseHandler.unexpectedError("login"));
      }
    }
  }
