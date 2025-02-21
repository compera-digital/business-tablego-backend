// app.ts

import express, { Express, Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ResponseHandler, Logger, Helper } from "./src/utils";
import { DbConnect } from "./src/core/infrastructure/database";
import { EndPoints, AuthController, UserController } from "./src/routes";
import {
  RegisterService,
  LoginService,
  DbService,
  MailService,
  VerificationService,
  UserService,
} from "./src/services";

import {
  IRegisterService,
  ILoginService,
  IDbService,
  IMailService,
  IVerificationService,
  ILogoutService,
} from "./src/services/types";

import { RedisClient } from "./src/core/infrastructure/redis";
import { AuthMiddleware } from "./src/middleware/auth";
import { config } from "./src/config/config";

export class App {
  private readonly app: Application;
  private readonly port: number;
  private readonly host: string;
  private readonly apiPrefix: string;
  private readonly jwtConfig;
  private readonly mailConfig;
  private readonly codeExpirationTime;
  private readonly cookieMaxAge;

  private logger;
  private responseHandler;
  private helper;
  private dbService;
  private dbConnect;
  private redisClient;
  private mailService;
  private verificationService;
  private registerService;
  private loginService;
  private userService;
  private authMiddleware;
  private endPoints;
  private authController;
  private userController;

  constructor() {
    this.app = express();
    this.port = config.getServerConfig().port;
    this.host = config.getServerConfig().host;
    this.apiPrefix = config.getServerConfig().apiPrefix;
    this.jwtConfig = config.getJwtConfig();
    this.mailConfig = config.getMailConfig();
    this.codeExpirationTime = config.getVerificationConfig().codeExpirationTime;
    this.cookieMaxAge = config.getFullAuthConfig().jwt.cookieMaxAge;

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Express middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // CORS configuration
    this.app.use(cors(config.getCorsConfig()));

    // Initialize services
    this.logger = new Logger("App");
    this.responseHandler = new ResponseHandler();

    this.helper = new Helper({
      jwtConfig: this.jwtConfig,
    });

    this.dbService = new DbService();
    this.dbConnect = DbConnect.getInstance({
      logger: new Logger("DbConnect"),
      databaseUrl: config.getDatabaseConfig().url,
    });
    this.redisClient = RedisClient.getInstance({
      logger: new Logger("Redis"),
      config: config.getRedisConfig(),
    });

    this.mailService = new MailService({
      config: this.mailConfig,
      logger: new Logger("MailService"),
    });

    this.verificationService = new VerificationService({
      mailService: this.mailService,
      redisClient: this.redisClient,
      helper: this.helper,
      logger: new Logger("VerificationService"),
      codeExpirationTime: this.codeExpirationTime,
      dbService: this.dbService,
      responseHandler: this.responseHandler,
    });

    this.registerService = new RegisterService({
      dbService: this.dbService,
      responseHandler: this.responseHandler,
      verificationService: this.verificationService,
      logger: new Logger("RegisterService"),
      helper: this.helper,
    });

    this.loginService = new LoginService({
      dbService: this.dbService,
      logger: new Logger("LoginService"),
      responseHandler: this.responseHandler,
      redisClient: this.redisClient,
      helper: this.helper,
    });

    this.authController = new AuthController({
      registerService: this.registerService,
      loginService: this.loginService,
      responseHandler: this.responseHandler,
      logger: new Logger("AuthController"),
      verificationService: this.verificationService,
      cookieMaxAge: this.cookieMaxAge,
    });

    this.authMiddleware = new AuthMiddleware({
      jwtToken: this.jwtConfig.jwtToken,
      responseHandler: this.responseHandler,
      logger: new Logger("AuthMiddleware"),
    });

    this.userService = new UserService({
      dbService: this.dbService,
      helper: this.helper,
      responseHandler: this.responseHandler,
      logger: new Logger("UserService"),
    });

    this.userController = new UserController({
      userService: this.userService,
      responseHandler: this.responseHandler,
      logger: new Logger("UserController"),
    });

    this.endPoints = new EndPoints({
      authController: this.authController,
      userController: this.userController,
      authMiddleware: this.authMiddleware,
    });
  }

  private setupRoutes(): void {
    this.app.use(this.apiPrefix, this.endPoints.getRouter());
  }

  public async start(): Promise<void> {
    try {
      this.logger.info("🚀 Starting application...");
      await this.dbConnect.connect();
      this.logger.info("✅ Database connection established.");

      this.app.listen(this.port, () => {
        const serverConfig = config.getServerConfig();
        this.logger.info(
          `✅ Server is running on http://${serverConfig.host}:${this.port}`
        );
      });
    } catch (error) {
      this.logger.error("❌ Server failed to start", error as Error);
    }
  }

  public getConfig(): any {
    return config;
  }

  public getApp(): Application {
    return this.app;
  }
}

export default new App();
