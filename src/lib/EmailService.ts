import nodemailer from 'nodemailer';

// Define an interface for the issue object to avoid 'any'
interface IssueDetails {
  id: string;
  title: string;
  type: string;
  priority: string;
  description: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // connect to Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,       // Ensure this matches .env
        pass: process.env.GMAIL_APP_PASSWORD, // Ensure this matches .env
      },
    });
  }

  // 1. WELCOME EMAIL (For Registration)
  async sendWelcomeEmail(toEmail: string, name: string) {
    try {
      await this.transporter.sendMail({
        from: `"ApniSec Team" <${process.env.GMAIL_USER}>`,
        to: toEmail,
        subject: 'Welcome to ApniSec!',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #333;">Welcome, ${name}!</h1>
            <p>Thank you for joining ApniSec. Your account has been successfully created.</p>
          </div>
        `,
      });
      console.log(`✅ Welcome Email sent to ${toEmail}`);
    } catch (error) {
      console.error("❌ Failed to send Welcome Email:", error);
    }
  }

  // 2. ISSUE NOTIFICATION EMAIL (The one triggered by IssueService)
  async sendIssueCreatedEmail(toEmail: string, name: string, issue: IssueDetails) {
    try {
      const info = await this.transporter.sendMail({
        from: `"ApniSec Support" <${process.env.GMAIL_USER}>`,
        to: toEmail,
        subject: `[ApniSec] Issue Reported: ${issue.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #030014; color: #ffffff; padding: 20px; border-radius: 8px;">
            <h2 style="color: #00f3ff; text-align: center;">Issue Report Received</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>We have received your security issue report. Our team is reviewing it.</p>
            
            <div style="background-color: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>ID:</strong> <span style="color: #bc13fe;">${issue.id}</span></p>
              <p style="margin: 5px 0;"><strong>Type:</strong> ${issue.type}</p>
              <p style="margin: 5px 0;"><strong>Priority:</strong> ${issue.priority}</p>
              <hr style="border-color: rgba(255,255,255,0.2);">
              <p style="margin: 10px 0; font-size: 14px;">${issue.description}</p>
            </div>

            <p style="font-size: 12px; color: #888; text-align: center;">
              This is an automated message from the ApniSec Dashboard.
            </p>
          </div>
        `,
      });
      console.log(`✅ Issue Email sent to ${toEmail}: ${info.messageId}`);
    } catch (error) {
      console.error("❌ Failed to send Issue Email:", error);
    }
  }
}