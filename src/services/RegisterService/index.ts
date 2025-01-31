import bcrypt from "bcrypt";
import { DbService } from "../dbService";
import { Logger } from "../../utils";
import { ResponseHandler } from "../../utils";

export class RegisterService {
  private readonly dbService: DbService;
  private readonly logger: Logger;
  private readonly responseHandler: ResponseHandler;

  constructor(dbService: DbService, logger: Logger, responseHandler: ResponseHandler) {
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
      this.logger.error("Error occurred during registration", error);
      return this.responseHandler.unexpectedError("registration");
    }
  }
}
