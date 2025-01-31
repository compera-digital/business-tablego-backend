import bcrypt from "bcrypt";
import { 
  IDbService, 
  IResponseHandler, 
  ILogger 
} from "../types";


export class LoginService {
  private readonly dbService: IDbService;
  private readonly logger: ILogger;
  private readonly responseHandler: IResponseHandler;
  
  constructor(
    dbService: IDbService, 
    logger: ILogger, 
    responseHandler: IResponseHandler
  ) { 
    this.dbService = dbService;
    this.logger = logger;
    this.responseHandler = responseHandler;
  }

  async login(email: string, password: string) {
    try {
      const user = await this.dbService.findUserByEmail(email);

      if (!user) {
        this.logger.warn("Failed login attempt: Invalid email or password", { email });
        return this.responseHandler.userNotFound(); 
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn("Failed login attempt: Invalid email or password", { email });
        return this.responseHandler.userNotFound(); 
      }

      this.logger.info("User logged in successfully", { email });

      // Remove password before returning user
      const { password: _, ...userWithoutPassword } = user;

      return this.responseHandler.loginSuccess({
        userId: userWithoutPassword.id,
        email: userWithoutPassword.email,
        userToken: "dummy-token", 

      });

    } catch (error) {
      this.logger.error("An error occurred during login", error);
      return this.responseHandler.unexpectedError("login"); 
    }
  }
}
