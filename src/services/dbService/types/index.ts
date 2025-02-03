// src/services/DbService/types/index.ts

import { RegisterUserDTO } from "../../../types/userTypes";
import { User } from "@prisma/client";

export interface IDbService {
  registerUser(userData: RegisterUserDTO): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
}
