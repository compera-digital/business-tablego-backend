export interface IHelper {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateVerificationCode(): Promise<string>;
  generateToken(user: any): string;
  validateEmail(email: string): boolean;
  formatDate(date: Date): string;
} 

export interface IUser {
  email: string;
  name: string;
  lastName: string;
}

export interface IHelperDependencies {
  jwtConfig: {
    jwtToken: string;
    jwtExpiresIn: string;
  };
}