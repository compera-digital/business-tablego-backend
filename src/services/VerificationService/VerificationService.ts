// VerificationService.ts

import { IVerificationService, IVerificationServiceDependencies } from "./types";

export class VerificationService implements IVerificationService {
  private readonly mailService;
  private readonly logger;
  private readonly helper;
  private readonly redisClient;
  private readonly responseHandler;
  private readonly codeExpirationTime;
  private readonly dbService;

  constructor({ mailService, redisClient, helper, logger, responseHandler, codeExpirationTime, dbService }: IVerificationServiceDependencies) {
    this.mailService = mailService;
    this.redisClient = redisClient;
    this.responseHandler = responseHandler;
    this.helper = helper;
    this.logger = logger;
    this.codeExpirationTime = codeExpirationTime;
    this.dbService = dbService;
  }

  async generateCode(email: string): Promise<string> {
    try {
      const code = await this.helper.generateVerificationCode();

      await this.redisClient.getClient().setex(`verification:${email}`, this.codeExpirationTime, code);
      await this.mailService.sendVerificationEmail(email, code);
      
      return code;
    } catch (error) {
      this.logger.error("Error generating verification code", error as Error);
      throw error;
    }
  }

  async verifyCode(email: string, code: string) {
    try {

      const user = await this.dbService.findUserByEmail(email);
      
      if (!user) {
        this.logger.info("User not found during verification", { email });
        return this.responseHandler.userNotFound();
      }

      if (user.isVerified) {
        this.logger.info("User is already verified", { email });
        return this.responseHandler.userAlreadyVerified();
      }

      const storedCode = await this.redisClient.getClient().get(`verification:${email}`);
      
      if (!storedCode) {
        this.logger.info("No verification code found or it has expired", { email });
        return this.responseHandler.verificationCodeExpired();
      }

      if (storedCode !== code) {
        this.logger.info("Verification code does not match", { email });
        return this.responseHandler.invalidVerificationCode();
      }

      await this.dbService.updateUserVerification(email, true);
      await this.redisClient.getClient().del(`verification:${email}`);
      
      this.logger.info("User verified successfully", { email });
      return this.responseHandler.verificationSuccess();    
    } catch (error) {
      this.logger.error("Error verifying code", error as Error);
      throw error;
    }
  }

  async resendCode(email: string) {
    try {

      const user = await this.dbService.findUserByEmail(email);
      
      if (!user) {
        this.logger.info("User not found for resending code", { email });
        return this.responseHandler.userNotFound();
      }

      if (user.isVerified) {
        this.logger.info("Cannot resend code: User is already verified", { email });
        return this.responseHandler.userAlreadyVerified();
      }

      const remainingTime = await this.redisClient.getClient().ttl(`verification:${email}`);
      
      if (remainingTime > 0) {
        this.logger.info("Cannot resend code: Previous code is still valid", { email, remainingTime });
        return this.responseHandler.verificationCodeNotExpired(email, remainingTime);
      }

      await this.generateCode(email);
      this.logger.info("Verification code resent successfully", { email });
      return this.responseHandler.verificationEmailResent();

    } catch (error) {
      this.logger.error("Error resending verification code", error as Error);
      throw error;
    }
  }
}
