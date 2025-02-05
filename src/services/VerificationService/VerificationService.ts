// VerificationService.ts

import { IVerificationService, IVerificationServiceDependencies } from "./types";

export class VerificationService implements IVerificationService {
  private readonly mailService;
  private readonly logger;
  private readonly helper;
  private readonly redisClient;
  private readonly codeExpirationTime 

  constructor({ mailService, redisClient, helper, logger, codeExpirationTime }: IVerificationServiceDependencies) {
    this.mailService = mailService;
    this.redisClient = redisClient;
    this.helper = helper;
    this.logger = logger;
    this.codeExpirationTime = codeExpirationTime;
  }


  async generateCode(email: string): Promise<string> {
    try {
      const code = this.helper.generateVerificationCode();
      
      await this.redisClient.getClient().setex(`verification:${email}`, this.codeExpirationTime, code);
      
      await this.mailService.sendVerificationEmail(email, code);
      
      this.logger.info("Verification code generated and sent", { email });
      return code;
    } catch (error) {
      this.logger.error("Error generating verification code", error as Error);
      throw error;
    }
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    try {
      const storedCode = await this.redisClient.getClient().get(`verification:${email}`);
      
      if (!storedCode) {
        this.logger.info("No verification code found or it has expired", { email });
        return false;
      }
      
      const isValid = storedCode === code;
      
      if (isValid) {
        
        await this.redisClient.getClient().del(`verification:${email}`);
        this.logger.info("Verification code matched and deleted", { email });
      } else {
        this.logger.info("Verification code does not match", { email });
      }
      
      return isValid;
    } catch (error) {
      this.logger.error("Error verifying code", error as Error);
      throw error;
    }
  }

  /**
   * Kullanıcıya yeni bir doğrulama kodu gönderir.
   * Basitçe generateCode metodunu tekrar çağırıyoruz.
   */
  async resendCode(email: string): Promise<boolean> {
    try {
      await this.generateCode(email);
      return true;
    } catch (error) {
      this.logger.error("Error resending verification code", error as Error);
      throw error;
    }
  }
}
