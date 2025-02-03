import bcrypt from "bcrypt";
import { IRegisterService, IRegisterServiceDependencies } from "./types";
export class RegisterService implements IRegisterService {
  private readonly dbService;
  private readonly logger;
  private readonly responseHandler;

  constructor({ dbService, logger, responseHandler }: IRegisterServiceDependencies) {
    this.dbService = dbService;
    this.logger = logger;
    this.responseHandler = responseHandler;
  }

  async register(name: string, email: string, password: string) {
    try {

      const existingUser = await this.dbService.findUserByEmail(email);
      if (existingUser) {
        this.logger.warn("Registration failed: Email already in use", { email });
        return this.responseHandler.emailInUse();
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.dbService.registerUser({ name, email, password: hashedPassword });

      this.logger.info("New user registered successfully", { email });

      return this.responseHandler.registrationSuccess(user.id, user.email);
    } catch (error) {
      this.logger.error("Error occurred during registration", error as Error);
      return this.responseHandler.unexpectedError("registration");
    }
  }
}
