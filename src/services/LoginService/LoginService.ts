import bcrypt from "bcrypt";
import { ILoginService, ILoginServiceDependencies } from "./types";

export class LoginService implements ILoginService {
  private readonly dbService;
  private readonly redisClient;
  private readonly logger;
  private readonly responseHandler;
  private readonly helper;

  constructor({ dbService, redisClient, logger, responseHandler, helper }: ILoginServiceDependencies) { 
    this.dbService = dbService;
    this.redisClient = redisClient;
    this.logger = logger;
    this.responseHandler = responseHandler;
    this.helper = helper;
  }

  async login(email: string, password: string) {
    try {
      const user = await this.dbService.findUserByEmail(email);

      if (!user) {
        this.logger.warn("Failed login attempt: Invalid email or password", { email });
        return this.responseHandler.invalidEmailFormat(); 
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn("Failed login attempt: Invalid email or password", { email });
        return this.responseHandler.invalidEmailFormat(); 
      }

      if (!user.isVerified) {
        const remainingTime = await this.redisClient.ttl(`verification:${email}`);
        this.logger.warn("Login attempt failed: User not verified", { email });
        return this.responseHandler.userNotVerified(user.email, user.isVerified, remainingTime);
      }

      this.logger.info("User logged in successfully", { email });

      const { password: _,  ...userWithoutPassword } = user;

      console.log(userWithoutPassword, "userWithoutPassword");

      const token = this.helper.generateToken(userWithoutPassword);

      return this.responseHandler.loginSuccess(
        userWithoutPassword,
        token
      );

    } catch (error) {
      this.logger.error("An error occurred during login", error as Error);
      return this.responseHandler.unexpectedError("login"); 
    }
  }
}
