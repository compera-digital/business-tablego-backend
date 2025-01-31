import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import yamlConfig from "./src/config/config.js";
import { Logger } from "./src/utils/Logger/index.js";
import { ResponseHandler } from "./src/utils/Responses/Responses.js";
import { DbService } from "./src/services/dbService/index.js";
import { EndPoints } from './src/routes/EndPoints.js';
import DbConnect from "./src/config/dbConnect.js";

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
    this.app.use(express.json());

    this.app.use(cors({
      origin: yamlConfig.cors.allowedOrigins,
      methods: yamlConfig.cors.allowedMethods
    }));

    this.app.use();
  }

  private configureRoutes(): void {
    const apiPrefix = yamlConfig.app.apiPrefix; 
    this.app.use(apiPrefix, EndPoints);
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
      this.logger.error("❌ Server failed to start", error);
    }
  }
}

export default new App();
