// src/backend/repositories/IssueRepository.ts
import { PrismaClient, Issue } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class IssueRepository {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  // Create a new issue
  async create(data: { title: string; description: string; type: string; userId: string }): Promise<Issue> {
    return await this.db.issue.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        userId: data.userId
      }
    });
  }
async findById(issueId: string): Promise<Issue | null> {
    return await this.db.issue.findUnique({ where: { id: issueId } });
  }
  // Get all issues for a specific user (Dashboard)
  async findAllByUserId(userId: string): Promise<Issue[]> {
    return await this.db.issue.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
async update(issueId: string, data: Partial<Issue>): Promise<Issue> {
    return await this.db.issue.update({
      where: { id: issueId },
      data
    });
  }
  // Delete an issue (Optional but good for CRUD)
  async delete(issueId: string, userId: string) {
    return await this.db.issue.deleteMany({
      where: { 
        id: issueId,
        userId: userId // Security: Ensure user owns the issue
      }
    });
  }
  
}