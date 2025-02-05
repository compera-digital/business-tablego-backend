// app.ts

import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import yamlConfig from "./src/config/config";
import { ResponseHandler, Logger, Helper } from "./src/utils";
import { DbConnect } from "./src/core/infrastructure/database";
import { EndPoints, AuthController } from "./src/routes";
import { 
  RegisterService, 
  LoginService, 
  DbService, 
  MailService, 
  VerificationService, 
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

dotenv.config({ path: ".env" });

export class App {
  private app: Express;
  private port: number;
  private logger: Logger;
  private responseHandler: ResponseHandler;
  private helper: Helper;
  private dbService: IDbService;
  private dbConnect: DbConnect;
  private redisClient: RedisClient;
  private registerService: IRegisterService;
  private loginService: ILoginService;
  private mailService: IMailService;
  private verificationService: IVerificationService;
  private authController: AuthController;
  private codeExpirationTime: number;
  private mailConfig: { 
    user: string;  
    pass: string; 
    server: string; 
    port: number 
  };

  constructor() {
    this.port = yamlConfig.app.port;
    this.app = express();

    this.codeExpirationTime = yamlConfig.verification.codeExpirationTime;

    this.mailConfig = {
      user: process.env.SMTP_USERNAME!,
      pass: process.env.SMTP_PASSWORD!,
      server: yamlConfig.mail.smtp.server,
      port: yamlConfig.mail.smtp.port,
    }

    this.logger = new Logger("App");
    this.responseHandler = new ResponseHandler();
    this.helper = new Helper();
    
    this.dbService = new DbService();
    this.dbConnect = DbConnect.getInstance({
      logger: new Logger("DbConnect"),
      databaseUrl: process.env.DATABASE_URL!,
    });
    this.redisClient = RedisClient.getInstance({
      logger: new Logger("Redis"),
      config: {
        host: process.env.REDIS_HOST!,                 
        port: parseInt(process.env.REDIS_PORT!),         
        password: process.env.REDIS_PASSWORD!,
      }
    });

    this.mailService = new MailService({
      config: this.mailConfig,
      logger: new Logger("MailService"),
    });

    this.registerService = new RegisterService({
      dbService: this.dbService,
      redisClient: this.redisClient,
      mailService: this.mailService,
      responseHandler: this.responseHandler,
      helper: this.helper,
      logger: new Logger("RegisterService"),
      codeExpirationTime: this.codeExpirationTime,
    });

    this.loginService = new LoginService({
      dbService: this.dbService,
      logger: new Logger("LoginService"),
      responseHandler: this.responseHandler,
    });

    this.verificationService = new VerificationService({
      mailService: this.mailService,
      redisClient: this.redisClient,
      helper: this.helper,
      logger: new Logger("VerificationService"),
      codeExpirationTime: this.codeExpirationTime,
    });
    this.authController = new AuthController({
      registerService: this.registerService,
      loginService: this.loginService,
      responseHandler: this.responseHandler,
      logger: new Logger("AuthController"),
    });

    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: yamlConfig.cors.allowedOrigins,
        methods: yamlConfig.cors.allowedMethods,
      })
    );
  }

  private configureRoutes(): void {
    const apiPrefix = yamlConfig.app.apiPrefix;
    const endpoints = new EndPoints(this.authController);
    this.app.use(apiPrefix, endpoints.getRouter());
  }

  public async start(): Promise<void> {
    try {
      this.logger.info("🚀 Starting application...");

      await this.dbConnect.connect();
      this.logger.info("✅ Database connection established.");

      this.app.listen(this.port, () => {
        this.logger.info(`✅ Server is running on http://${yamlConfig.app.host}:${this.port}`);
      });
    } catch (error) {
      this.logger.error("❌ Server failed to start", error as Error);
    }
  }
}

export default new App();
