import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import yamlConfig from "./src/config/config";
import { ResponseHandler, Logger } from "./src/utils";
import DbConnect from "./src/config/dbConnect";

import { EndPoints, AuthController } from "./src/routes";
import { RegisterService, LoginService, DbService } from "./src/services";

dotenv.config({ path: ".env" });

export class App {
  private app: Express;
  private port: number;
  private logger: Logger;
  private responseHandler: ResponseHandler;
  private dbService: DbService;

  constructor() {
    this.port = yamlConfig.app.port;
    this.app = express();

    this.logger = new Logger("App");
    this.responseHandler = new ResponseHandler();
    this.dbService = new DbService();

    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    // JSON body parsing ve CORS ayarları
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: yamlConfig.cors.allowedOrigins,
        methods: yamlConfig.cors.allowedMethods,
      })
    );
    // Burada başka global middleware'ler ekleyebilirsiniz.
  }

  private configureRoutes(): void {
    const apiPrefix = yamlConfig.app.apiPrefix;

    // AuthController için gerekli servisleri oluşturuyoruz:
    const registerService = new RegisterService({
      dbService: this.dbService,
      logger: this.logger,
      responseHandler: this.responseHandler,
    });
    const loginService = new LoginService({
      dbService: this.dbService,
      logger: this.logger,
      responseHandler: this.responseHandler,
    });

    // AuthController'ı, dependency injection yöntemiyle oluşturuyoruz:
    const authController = new AuthController({
      registerService,
      loginService,
      responseHandler: this.responseHandler,
      logger: this.logger,
    });

    // EndPoints sınıfını, AuthController ile oluşturup router'ı alıyoruz:
    const endpoints = new EndPoints(authController);

    // API prefix'ine bağlı olarak route'ları ekliyoruz:
    this.app.use(apiPrefix, endpoints.getRouter());
  }

  public async start(): Promise<void> {
    try {
      this.logger.info("🚀 Starting application...");

      await DbConnect.connect();
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
