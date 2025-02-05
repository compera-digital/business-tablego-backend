// src/services/DbService/types/index.ts

import { User } from "@/core/types/models";


export type RegisterUserDTO = {
  name: string;
  lastName: string; 
  email: string;
  referralCode: string;
  password: string;
  isVerified: boolean;
}

export type ResgisterdUserDto  = {
  name: string;
  lastName: string;
  email: string;
}


export interface IDbService {

  registerUser(userData: RegisterUserDTO): Promise<ResgisterdUserDto>;

  findUserByEmail(email: string): Promise<User | null>;

  updateUserVerification(email: string, isVerified: boolean): Promise<User>;
}
