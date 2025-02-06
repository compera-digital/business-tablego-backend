// src/services/DbService/types/index.ts

import { User } from "@/core/types/models";
import { RegisterUserDTO, ResgisterdUserDto } from "@/core/types/dto";


export interface IDbService {

  registerUser(userData: RegisterUserDTO): Promise<ResgisterdUserDto>;

  findUserByEmail(email: string): Promise<User | null>;

  updateUserVerification(email: string, isVerified: boolean): Promise<User>;
}


