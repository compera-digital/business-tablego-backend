import bcrypt from "bcrypt";
import { ILoginService, ILoginServiceDependencies } from "./types";

export class LoginService implements ILoginService {
  private readonly dbService;
  private readonly logger;
  private readonly responseHandler;
  
  constructor({ dbService, logger, responseHandler }: ILoginServiceDependencies) { 
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

      const { password: _, ...userWithoutPassword } = user;

      return this.responseHandler.loginSuccess(
        userWithoutPassword.id,
        userWithoutPassword.email,
        "dummy-token" 
      );

    } catch (error) {
      this.logger.error("An error occurred during login", error as Error);
      return this.responseHandler.unexpectedError("login"); 
    }
  }
}
