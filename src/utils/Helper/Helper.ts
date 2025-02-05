import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { IHelper } from './types';

export class Helper implements IHelper {
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public async generateVerificationCode(): Promise<string> {
    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase(); 
    return verificationCode;
  }

  public generateToken(user: any): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }

  public validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  public formatDate(date: Date): string {
    return date.toISOString();
  }
}

// Singleton instance
export const helper = new Helper(); 