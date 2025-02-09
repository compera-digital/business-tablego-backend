export interface IHelper {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateVerificationCode(): Promise<string>;
  generatePasswordResetToken(user: any): Promise<string>;
  generateToken(user: any): Promise<string>;
  validateEmail(email: string): Promise<boolean>;
  formatDate(date: Date): Promise<string>;
  verifyPasswordResetToken(token: string): Promise<{ valid: boolean; email?: string }>;
} 

export interface PasswordResetTokenPayload {
  type: string;
  email: string;
  id: string;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  lastName: string;
  isVerified: boolean;
  referralCode: string | null;
  createdAt: Date;
  updatedAt: Date; 
}

export interface IHelperDependencies {
  jwtConfig: {
    jwtToken: string;
    jwtExpiresIn: string;
  };
}