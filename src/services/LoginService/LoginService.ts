import { ILoginService, ILoginServiceDependencies } from "./types";
import { AuthProvider } from "@prisma/client";

export class LoginService implements ILoginService {
  private readonly dbService;
  private readonly helper;
  private readonly responseHandler;
  private readonly logger;

  constructor({
    dbService,
    helper,
    responseHandler,
    logger,
  }: ILoginServiceDependencies) {
    this.dbService = dbService;
    this.helper = helper;
    this.responseHandler = responseHandler;
    this.logger = logger;
  }

  async login(email: string, password: string) {
    try {
      const user = await this.dbService.findUserByEmail(email);
      if (!user) {
        return this.responseHandler.invalidEmailOrPassword();
      }

      const isPasswordValid = await this.helper.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return this.responseHandler.invalidEmailOrPassword();
      }

      if (!user.isVerified) {
        return this.responseHandler.userNotVerified(
          user.email,
          user.isVerified,
          0
        );
      }

      const { password: _, ...userWithoutPassword } = user;
      const accessToken = await this.helper.generateAccessToken(
        userWithoutPassword
      );
      return this.responseHandler.loginSuccess(
        userWithoutPassword,
        accessToken
      );
    } catch (error) {
      this.logger.error("Login failed", error as Error);
      return this.responseHandler.unexpectedError("Login failed");
    }
  }
}
