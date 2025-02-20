import { ILoginService, ILoginServiceDependencies } from "./types";
import { AuthProvider } from "@prisma/client";

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
        return this.responseHandler.invalidEmailOrPassword(); 
      }

      const isPasswordValid = await this.helper.comparePassword(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn("Failed login attempt: Invalid email or password", { email });
        return this.responseHandler.invalidEmailOrPassword(); 
      }

      if (!user.isVerified) {
        const remainingTime = await this.redisClient.ttl(`verification:${email}`);
        this.logger.warn("Login attempt failed: User not verified", { email });
        return this.responseHandler.userNotVerified(user.email, user.isVerified, remainingTime);
      }

      this.logger.info("User logged in successfully", { email });

      const { password: _,  ...userWithoutPassword } = user;

      const accessToken = await this.helper.generateAccessToken(userWithoutPassword);

      return this.responseHandler.loginSuccess(
        userWithoutPassword,
        accessToken
      );

    } catch (error) {
      this.logger.error("An error occurred during login", error as Error);
      return this.responseHandler.unexpectedError("login"); 
    }
  }

  async googleLogin(token: string) {
    try {
      const googleUser = await this.helper.verifyGoogleToken(token);
      let user = await this.dbService.findUserByEmail(googleUser.email);

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        const accessToken = await this.helper.generateAccessToken(userWithoutPassword);
        return this.responseHandler.loginSuccess(userWithoutPassword, accessToken);
      }

      const hashedPassword = await this.helper.hashPassword(
        this.helper.generateRandomPassword()
      );

      await this.dbService.registerUser({
        name: googleUser.name,
        lastName: googleUser.lastName,
        email: googleUser.email,
        referralCode: '',
        password: hashedPassword,
        isVerified: true,
        authProvider: 'GOOGLE' as AuthProvider
      });

      user = await this.dbService.findUserByEmail(googleUser.email);

      if (!user) {
        return this.responseHandler.unexpectedError('User not created');
      }

      const { password: _, ...userWithoutPassword } = user;
      const accessToken = await this.helper.generateAccessToken(userWithoutPassword);
      return this.responseHandler.loginSuccess(userWithoutPassword, accessToken);

    } catch (error) {
      this.logger.error('Google login failed', error as Error);
      return this.responseHandler.unexpectedError('Google login failed');
    }
  }
}
