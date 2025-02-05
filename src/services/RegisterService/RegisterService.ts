import bcrypt from "bcrypt";
import { IRegisterService, IRegisterServiceDependencies } from "./types";

export class RegisterService implements IRegisterService {
  private readonly dbService;
  private readonly redisClient;
  private readonly mailService;
  private readonly responseHandler;
  private readonly helper;
  private readonly logger;
  private readonly codeExpirationTime;
  constructor({ dbService, redisClient, mailService, responseHandler, helper, logger, codeExpirationTime }: IRegisterServiceDependencies) {
    this.dbService = dbService;
    this.redisClient = redisClient;
    this.mailService = mailService;
    this.responseHandler = responseHandler;
    this.helper = helper;
    this.logger = logger;
    this.codeExpirationTime = codeExpirationTime;
  }

  async register(name: string, lastName: string, email: string, referralCode: string, password: string) {
    try {
      const existingUser = await this.dbService.findUserByEmail(email);

      if (existingUser) {
        if (!existingUser.isVerified) {
          this.logger.warn(`Registration pending: User ${email} needs to verify their account`);
          const remainingTime = await this.redisClient.ttl(`verification:${email}`);
          return this.responseHandler.userNotVerified(existingUser.email, remainingTime);
        } else {
          this.logger.warn(`Registration rejected: Email ${email} is already registered`);
          return this.responseHandler.emailInUse();
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.dbService.registerUser({
        name,
        lastName,
        email,
        referralCode,
        password: hashedPassword,
        isVerified: false,
      });

      const verificationCode = await this.helper.generateVerificationCode();
      await this.mailService.sendVerificationEmail(email, verificationCode);
      await this.redisClient.setEx(`verification:${email}`, 300, verificationCode);

      this.logger.info(`User registration successful: Verification email sent to ${email}`);
      return this.responseHandler.registrationSuccess(user.name, user.lastName, user.email);

    } catch (error) {
      this.logger.error(`Registration failed: ${(error as Error).message}`, error as Error);
      return this.responseHandler.unexpectedError("registration");
    }
  }
}
