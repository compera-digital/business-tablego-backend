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
  UserService
} from "./src/services";

import { 
  IRegisterService,
  ILoginService,
  IDbService,
  IMailService, 
  IVerificationService,
  ILogoutService
} from "./src/services/types";

import { RedisClient } from "./src/core/infrastructure/redis";
import { AuthMiddleware } from "./src/middleware/auth";
import { OAuth2Client } from 'google-auth-library';
import { config } from './src/config/config';

export class App {
  private readonly app: Application;
  private readonly port: number;
  private readonly jwtConfig: ReturnType<typeof config.getJwtConfig>;
  private readonly mailConfig: ReturnType<typeof config.getMailConfig>;
  private logger!: Logger;
  private responseHandler!: ResponseHandler;
  private helper!: Helper;
  private dbService!: IDbService;
  private dbConnect!: DbConnect;
  private redisClient!: RedisClient;
  private registerService!: IRegisterService;
  private loginService!: ILoginService;
  private mailService!: IMailService;
  private verificationService!: IVerificationService;
  private authController!: AuthController;
  private codeExpirationTime!: number;
  private cookieMaxAge!: number;
  private authMiddleware!: AuthMiddleware;
  private endpoints!: EndPoints;
  private userService!: UserService;
  private userController!: UserController;

  constructor() {
    this.app = express();
    this.port = config.getPort();
    this.jwtConfig = config.getJwtConfig();
    this.mailConfig = config.getMailConfig();
    
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


    this.codeExpirationTime = config.getVerificationConfig().codeExpirationTime;
    this.cookieMaxAge = config.getFullAuthConfig().jwt.cookieMaxAge;

    // Initialize services
    this.logger = new Logger("App");
    this.responseHandler = new ResponseHandler();
    
    const googleClient = new OAuth2Client(config.getGoogleConfig().clientId);
    this.helper = new Helper({ 
      jwtConfig: this.jwtConfig,
      googleClientId: googleClient 
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
      logger: new Logger("UserService")
    });

    this.userController = new UserController({
      userService: this.userService,
      responseHandler: this.responseHandler,
      logger: new Logger("UserController")
    });

    this.endpoints = new EndPoints({
      authController: this.authController,
      userController: this.userController,
      authMiddleware: this.authMiddleware
    });

  }

  private setupRoutes(): void {
    const apiPrefix = config.getApiPrefix();
    this.app.use(apiPrefix, this.endpoints.getRouter());
  }

  public async start(): Promise<void> {
    try {
      this.logger.info("🚀 Starting application...");
      await this.dbConnect.connect();
      this.logger.info("✅ Database connection established.");

      this.app.listen(this.port, () => {
        const serverConfig = config.getServerConfig();
        this.logger.info(`✅ Server is running on http://${serverConfig.host}:${this.port}`);
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
