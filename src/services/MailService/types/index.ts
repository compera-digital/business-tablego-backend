import { ILogger } from "@/utils/Logger";

export interface IMailService {
  sendVerificationEmail(to: string, code: string): Promise<void>;
  sendWelcomeEmail(to: string, name: string): Promise<void>;
  sendPasswordResetEmail(to: string, resetLink: string): Promise<void>;
}

export interface IMailServiceDependencies {
  config: { 
    user: string; 
    pass: string; 
    server: string; 
    port: number 
  };
  logger: ILogger;
} 