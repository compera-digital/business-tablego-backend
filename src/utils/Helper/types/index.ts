// User related interfaces
export interface IUser {
  id: string;
  email: string;
  name: string;
  lastName: string;
}

// Authentication related interfaces
export interface PasswordResetTokenPayload {
  type: string;
  email: string;
  id: string;
}

// Configuration interfaces
export interface IHelperDependencies {
  jwtConfig: {
    jwtToken: string;
    jwtExpiresIn: string | number;
  };
}

// Main Helper interface
export interface IHelper {
  // Authentication methods
  generateAccessToken(user: IUser): Promise<string>;

  // Password related methods
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  generateRandomPassword(): string;

  // Password reset methods
  generatePasswordResetToken(user: IUser): Promise<string>;
  verifyPasswordResetToken(
    token: string
  ): Promise<{ valid: boolean; email?: string }>;

  // Verification methods
  generateVerificationCode(): Promise<string>;

  // Validation methods
  validateEmail(email: string): Promise<boolean>;

  // Utility methods
  formatDate(date: Date): Promise<string>;
}
