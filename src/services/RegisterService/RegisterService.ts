import { IRegisterService, IRegisterServiceDependencies } from "./types";
import { AuthProvider } from "@prisma/client";

export class RegisterService implements IRegisterService {
  private readonly dbService;
  private readonly verificationService;
  private readonly responseHandler;
  private readonly logger;
  private readonly helper;

  constructor({ dbService, verificationService, responseHandler, logger, helper }: IRegisterServiceDependencies) {
    this.dbService = dbService;
    this.responseHandler = responseHandler;
    this.verificationService = verificationService;
    this.logger = logger;
    this.helper = helper;
  }

  async register(name: string, lastName: string, email: string, referralCode: string, password: string) {
    try {
      if (!this.helper.validateEmail(email)) {
        this.logger.warn(`Invalid email: ${email}`);
        return this.responseHandler.invalidEmailFormat(); 
      }

      const existingUser = await this.dbService.findUserByEmail(email);
      if (existingUser) {
        this.logger.warn(`Registration rejected: Email ${email} is already registered`);
        return this.responseHandler.emailInUse();
      }

      const hashedPassword = await this.helper.hashPassword(password);
      const user = await this.dbService.registerUser({
        name,
        lastName,
        email,
        referralCode,
        password: hashedPassword,
        isVerified: false,
        authProvider: 'EMAIL' as AuthProvider
      });

      await this.verificationService.generateCode(email);

      this.logger.info(`User registration successful: Verification email sent to ${email}`);
      return this.responseHandler.registrationSuccess(user.name, user.lastName, user.email);
    } catch (error) {
      this.logger.error(`Registration failed: ${(error as Error).message}`, error as Error);
      return this.responseHandler.unexpectedError("registration");
    }
  }
}
