import { PrismaClient } from "@prisma/client";
import { IDbService, RegisterUserDTO } from "./types";

export class DbService implements IDbService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }                 

  async registerUser(userData: RegisterUserDTO) {
    return this.prisma.user.create({ data: userData });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUserVerification(email: string, isVerified: boolean) {
    return this.prisma.user.update({
      where: { email },
      data: { isVerified }
    });
  }
}
