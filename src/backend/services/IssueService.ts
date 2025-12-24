import { IssueRepository } from '../repositories/IssueRepository';
import { AppError } from '@/lib/AppError'; // Ensure this path matches your project alias

export class IssueService {
  private static instance: IssueService;
  private issueRepo: IssueRepository;

  // 1. Private Constructor (Singleton Pattern)
  private constructor() {
    this.issueRepo = new IssueRepository();
  }

  // 2. Static Method to get the Instance
  public static getInstance(): IssueService {
    if (!IssueService.instance) {
      IssueService.instance = new IssueService();
    }
    return IssueService.instance;
  }

  // 3. Create Issue (Updated with Priority)
  async createIssue(data: any, userId: string) {
    // Validate Issue Type
    const validTypes = ['Cloud Security', 'Red Team Assessment', 'VAPT'];
    if (!validTypes.includes(data.type)) {
      throw new AppError("Invalid issue type. Must be: Cloud Security, VAPT, or Red Team Assessment", 400);
    }

    if (!data.title || !data.description) {
      throw new AppError("Title and description are required", 400);
    }

    // Save to DB (Passing Priority)
    const issue = await this.issueRepo.create({
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority || 'Medium', // Default to Medium if missing
      userId: userId
    });

    return issue;
  }

  // 4. Get User Issues
  async getUserIssues(userId: string) {
    return await this.issueRepo.findAllByUserId(userId);
  }

  // 5. Get Single Issue (with Security Check)
  async getIssueById(userId: string, issueId: string) {
    const issue = await this.issueRepo.findById(issueId);
    if (!issue) throw new AppError("Issue not found", 404);
    
    // Security: User can only see their own issues
    if (issue.userId !== userId) throw new AppError("Unauthorized access to this issue", 403);
    
    return issue;
  }

  // 6. Update Issue
  async updateIssue(userId: string, issueId: string, data: any) {
    // Check ownership first
    await this.getIssueById(userId, issueId);

    // Perform update
    return await this.issueRepo.update(issueId, data);
  }

  // 7. Delete Issue
  async deleteIssue(userId: string, issueId: string) {
    // Check ownership first
    await this.getIssueById(userId, issueId);

    // Perform delete
    await this.issueRepo.delete(issueId, userId);
    return { message: "Issue deleted successfully" };
  }
}