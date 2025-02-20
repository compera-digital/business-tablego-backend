import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from "crypto";
import { IHelper, IHelperDependencies, IUser, PasswordResetTokenPayload, GoogleUserInfo } from './types';

export class Helper implements IHelper {
  private readonly jwtToken;
  private readonly jwtExpiresIn;
  private readonly googleClient;
  private readonly googleClientId;

  constructor({ jwtConfig, googleClientId }: IHelperDependencies) { 
    this.jwtToken = jwtConfig.jwtToken;
    this.jwtExpiresIn = jwtConfig.jwtExpiresIn;
    this.googleClientId = googleClientId;
    this.googleClient = googleClientId;
  }

  // Authentication related methods
  public async generateAccessToken(user: IUser): Promise<string> {
    const options: jwt.SignOptions = {
      expiresIn: this.jwtExpiresIn as SignOptions["expiresIn"]
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

  // Google Authentication related methods
  public async verifyGoogleToken(token: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.googleClientId.toString()
      });
      
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new Error('Invalid token payload');
      }
      
      return {
        email: payload.email,
        name: payload.given_name || '',
        lastName: payload.family_name || '',
        picture: payload.picture || ''
      };
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }

  // Password related methods
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public generateRandomPassword(): string {
    return crypto.randomBytes(20).toString('hex');
  }

  // Password reset related methods
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

  // Verification related methods
  public async generateVerificationCode(): Promise<string> {
    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase(); 
    return verificationCode;
  }

  // Validation methods
  public async validateEmail(email: string): Promise<boolean> {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Utility methods
  public async formatDate(date: Date): Promise<string> {
    return date.toISOString();
  }
}
