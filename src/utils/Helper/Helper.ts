import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from "crypto";
import { IHelper, IHelperDependencies, IUser } from './types';

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

  public generateToken(user: IUser): string {

    const options: jwt.SignOptions = {
      expiresIn: this.jwtExpiresIn  as SignOptions["expiresIn"]
    };

    return jwt.sign(
      { id: user.id, email: user.email, name: user.name, lastName: user.lastName },
      this.jwtToken,
      options
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
