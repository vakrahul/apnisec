import { PrismaClient, User } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class UserRepository {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.db.user.findUnique({ where: { email } });
  }

  async create(data: any): Promise<User> {
    return await this.db.user.create({ data });
  }
  async findById(id: string): Promise<User | null> {
    return await this.db.user.findUnique({ where: { id } });
  }
}