import { prisma } from '@/lib/prisma';
import { EmailService } from './EmailService'; // Import your Email Service

// Define the Interface for strict typing
export interface CreateIssueDTO {
  title: string;
  type: string;
  description: string;
  priority: string; // 'High', 'Medium', 'Low'
  status: string;   // 'Open', 'Resolved', etc.
  userId: string;
}

export class IssueService {
  private static instance: IssueService;
  private emailService: EmailService; // 1. Add EmailService property

  // Private constructor (Singleton Pattern)
  private constructor() {
    this.emailService = new EmailService(); // 2. Initialize EmailService
  }

  public static getInstance(): IssueService {
    if (!IssueService.instance) {
      IssueService.instance = new IssueService();
    }
    return IssueService.instance;
  }

  // --- 1. Get All Issues ---
  async getAllIssues() {
    return await prisma.issue.findMany({
      orderBy: { createdAt: 'desc' },
      // Optional: Include user name if you want to show who reported it
      include: { 
        user: { 
          select: { name: true, email: true } 
        } 
      } 
    });
  }

  // --- 2. Create Issue (With Email Notification) ---
  async createIssue(data: CreateIssueDTO) {
    // A. Create the Issue in Database
    const newIssue = await prisma.issue.create({
      data: {
        title: data.title,
        type: data.type,
        description: data.description,
        priority: data.priority,
        status: data.status,
        userId: data.userId
      }
    });

    // B. Fetch the User to get their Email Address
    // (We need this because 'data' only contains the userId string)
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    // C. Send the Email (Fire & Forget)
    if (user && user.email) {
      // We don't 'await' this because we don't want to make the user wait for the email to send.
      // We let it run in the background.
      this.emailService.sendIssueCreatedEmail(
        user.email, 
        user.name || 'User', 
        {
          id: newIssue.id,
          title: newIssue.title,
          type: newIssue.type,
          priority: newIssue.priority,
          description: newIssue.description
        }
      ).catch(error => {
        console.error("⚠️ Background Email Failed:", error);
      });
    }

    return newIssue;
  }

  // --- 3. Update Status (Close/Pending) ---
  async updateStatus(issueId: string, newStatus: string) {
    return await prisma.issue.update({
      where: { id: issueId },
      data: { status: newStatus }
    });
  }

  // --- 4. Delete Issue (Optional helper) ---
  async deleteIssue(id: string) {
    return await prisma.issue.delete({
      where: { id }
    });
  }
}