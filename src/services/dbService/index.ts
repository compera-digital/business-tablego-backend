import { PrismaClient } from '@prisma/client';


export class DbService {
  private prisma: PrismaClient
  
  constructor() {
    this.prisma = new PrismaClient();
  }

  async registerUser(userData: any) {
    return this.prisma.user.create({ data: userData });
  }

  async loginUser(email: string, password: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

}
