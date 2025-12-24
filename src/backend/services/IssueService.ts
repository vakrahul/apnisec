// src/backend/services/IssueService.ts
import { IssueRepository } from '../repositories/IssueRepository';
import { UserRepository } from '../repositories/UserRepository';
import { EmailService } from '../../lib/EmailService';
import { AppError } from '../../lib/AppError';

export class IssueService {
  private issueRepo: IssueRepository;

  constructor(issueRepo: IssueRepository) {
    this.issueRepo = issueRepo;
  }

  async createIssue(userId: string, data: any) {
    // 1. Validate Issue Type
    const validTypes = ['Cloud Security', 'Reteam Assessment', 'VAPT'];
    if (!validTypes.includes(data.type)) {
      throw new AppError("Invalid issue type. Must be: Cloud Security, VAPT, or Reteam Assessment", 400);
    }

    if (!data.title || !data.description) {
      throw new AppError("Title and description are required", 400);
    }

    // 2. Save to DB
    const issue = await this.issueRepo.create({
      ...data,
      userId
    });

    // TODO: Send Email Notification here (Resend)
    
    return issue;
  }

  async getUserIssues(userId: string) {
    return await this.issueRepo.findAllByUserId(userId);
  }
  async getIssueById(userId: string, issueId: string) {
    const issue = await this.issueRepo.findById(issueId);
    if (!issue) throw new AppError("Issue not found", 404);
    if (issue.userId !== userId) throw new AppError("Unauthorized access to this issue", 403);
    return issue;
  }

  async updateIssue(userId: string, issueId: string, data: any) {
    // 1. Check ownership first
    await this.getIssueById(userId, issueId);

    // 2. Perform update
    return await this.issueRepo.update(issueId, data);
  }

  async deleteIssue(userId: string, issueId: string) {
    // 1. Check ownership first
    await this.getIssueById(userId, issueId);

    // 2. Perform delete
    await this.issueRepo.delete(issueId, userId);
    return { message: "Issue deleted successfully" };
  }
}