import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from "crypto";
import { IHelper, IHelperDependencies, IUser, PasswordResetTokenPayload } from './types';

export class Helper implements IHelper {
  private readonly jwtToken;
  private readonly jwtExpiresIn;

  constructor({ jwtConfig }: IHelperDependencies) { 
    this.jwtToken = jwtConfig.jwtToken;
    this.jwtExpiresIn = jwtConfig.jwtExpiresIn;
  }
  
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

  public async generatePasswordResetToken(user: IUser): Promise<string>  {
    const options: jwt.SignOptions = {
      expiresIn: '30m' 
    };

    return jwt.sign(
      { 
        type: 'password_reset',
        email: user.email,
        id: user.id 
      },
      this.jwtToken,
      options
    );
  }

  public async generateToken(user: IUser): Promise<string> {

    const options: jwt.SignOptions = {
      expiresIn: this.jwtExpiresIn  as SignOptions["expiresIn"]
    };

    return jwt.sign(
      { 
        type: 'access', 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        lastName: user.lastName 
      },
      this.jwtToken,
      options
    );
  }

  public async validateEmail(email: string): Promise<boolean> {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  public async verifyPasswordResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    try {
      const decoded = jwt.verify(token, this.jwtToken) as PasswordResetTokenPayload;
      if (decoded && decoded.type === 'password_reset' && decoded.email) {
        return { valid: true, email: decoded.email };
      }
      return { valid: false };
    } catch (error) {
      return { valid: false };
    }
  }
  
  

  public async formatDate(date: Date): Promise<string> {
    return date.toISOString();
  }
}
