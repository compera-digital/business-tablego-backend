export interface IHelper {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateVerificationCode(): string;
  generateToken(user: any): string;
  validateEmail(email: string): boolean;
  formatDate(date: Date): string;
} 