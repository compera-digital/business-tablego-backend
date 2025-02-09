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

  constructor({ 
    mailService, 
    redisClient, 
    helper, 
    logger, 
    responseHandler, 
    codeExpirationTime, 
    dbService 
  }: IVerificationServiceDependencies) {
    this.mailService = mailService;
    this.redisClient = redisClient;
    this.responseHandler = responseHandler;
    this.helper = helper;
    this.logger = logger;
    this.codeExpirationTime = codeExpirationTime;
    this.dbService = dbService;
  }

  // Email Verification Methods
  async generateCode(email: string): Promise<string> {
    try {
      const code = await this.helper.generateVerificationCode();
      await this.redisClient.getClient().setex(
        `verification:${email}`, 
        this.codeExpirationTime, 
        code
      );
      
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
        this.logger.info("Verification code expired", { email });
        return this.responseHandler.verificationCodeExpired();
      }

      if (storedCode !== code) {
        this.logger.info("Invalid verification code", { email });
        return this.responseHandler.invalidVerificationCode();
      }

      await this.dbService.updateUserVerification(email, true);
      await this.redisClient.getClient().del(`verification:${email}`);

      const { password: _, ...userWithoutPassword } = user;
      const token = await this.helper.generateToken(userWithoutPassword);
      
      return this.responseHandler.verificationSuccess(userWithoutPassword, token);
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
        this.logger.info("User already verified", { email });
        return this.responseHandler.userAlreadyVerified();
      }

      const remainingTime = await this.redisClient.getClient().ttl(`verification:${email}`);
      if (remainingTime > 0) {
        this.logger.info("Previous code still valid", { email, remainingTime });
        return this.responseHandler.verificationCodeNotExpired(email, remainingTime);
      }

      await this.generateCode(email);
      return this.responseHandler.verificationEmailResent();
    } catch (error) {
      this.logger.error("Error resending code", error as Error);
      throw error;
    }
  }

  // Password Reset Methods
  async forgotPassword(email: string) {
    try {
      const user = await this.dbService.findUserByEmail(email);
      if (!user) {
        this.logger.info("User not found for password reset", { email });
        return this.responseHandler.nonExistentEmailForPasswordReset();
      }

      const resetToken = await this.helper.generatePasswordResetToken(user);
      const resetLink = `http://localhost:3000/reset-password?resetToken=${resetToken}`;
      
      await this.redisClient.getClient().setex(
        `passwordReset:${user.email}`, 
        this.codeExpirationTime,
        resetToken
      );

      await this.mailService.sendPasswordResetEmail(email, resetLink);
      return this.responseHandler.passwordResetLinkSent();
    } catch (error) {
      this.logger.error("Error sending reset link", error as Error);
      throw error;
    }
  }

  async verifyPasswordResetToken(resetToken: string) {
    try {
      const verification = await this.helper.verifyPasswordResetToken(resetToken);
      if (!verification.valid || !verification.email) {
        return this.responseHandler.passwordResetLinkExpired();
      }

      const storedToken = await this.redisClient.getClient().get(
        `passwordReset:${verification.email}`
      );
      
      if (!storedToken) {
        return this.responseHandler.passwordResetLinkExpired();
      }

      return storedToken === resetToken ? 
        this.responseHandler.passwordResetLinkVerified() : 
        this.responseHandler.invalidPasswordResetLink();
    } catch (error) {
      this.logger.error("Error verifying reset token", error as Error);
      throw error;
    }
  }

  async resetPassword(resetToken: string, newPassword: string) {
    try {
      const verification = await this.helper.verifyPasswordResetToken(resetToken);
      if (!verification.valid || !verification.email) {
        return this.responseHandler.passwordResetLinkExpired();
      }

      const email = verification.email;
      const storedToken = await this.redisClient.getClient().get(`passwordReset:${email}`);
      if (!storedToken || storedToken !== resetToken) {
        return this.responseHandler.invalidPasswordResetLink();
      }

      const hashedPassword = await this.helper.hashPassword(newPassword);
      await this.dbService.updateUserPassword(email, hashedPassword);
      await this.redisClient.getClient().del(`passwordReset:${email}`);

      return this.responseHandler.passwordResetSuccess();
    } catch (error) {
      this.logger.error("Error resetting password", error as Error);
      throw error;
    }
  }
}
