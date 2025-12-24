import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { IssueService } from '../services/IssueService';
import { IssueRepository } from '../repositories/IssueRepository';
import { RateLimiter } from '@/backend/middleware/RateLimiter';

export class IssueHandler {
  private issueService: IssueService;

  constructor() {
    this.issueService = new IssueService(new IssueRepository());
  }

  // --- Helper: Rate Limit Check ---
  private checkRateLimit(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    return RateLimiter.getInstance().check(ip);
  }

  // --- Helper: Extract User ID from Token ---
  private getUserId(req: NextRequest): string | null {
    console.log("🔍 [Debug] Checking Auth for request...");

    // 1. Check for Cookie
    const cookie = req.cookies.get('auth_token');
    if (!cookie) {
        console.log("❌ [Debug] Error: 'auth_token' cookie is MISSING.");
        return null;
    }
    console.log("🍪 [Debug] Cookie found. Token:", cookie.value.substring(0, 10) + "...");

    // 2. Check for Secret
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.log("❌ [Debug] CRITICAL ERROR: process.env.JWT_SECRET is undefined. Check .env.local!");
        return null;
    }

    // 3. Verify Token
    try {
      const decoded: any = jwt.verify(cookie.value, secret);
      console.log("✅ [Debug] Token Valid! UserID:", decoded.userId);
      return decoded.userId;
    } catch (e: any) {
      console.log("❌ [Debug] Token Verification Failed:", e.message);
      return null;
    }
  }

  // GET: List all issues
  async getIssues(req: NextRequest) {
    const userId = this.getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized - Check Terminal Logs" }, { status: 401 });

    try {
      const issues = await this.issueService.getUserIssues(userId);
      return NextResponse.json({ success: true, data: issues });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // POST: Create a new issue
  async createIssue(req: NextRequest) {
    const limit = this.checkRateLimit(req);
    if (!limit.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const userId = this.getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized - Check Terminal Logs" }, { status: 401 });

    try {
      const body = await req.json();
      const issue = await this.issueService.createIssue(userId, body);
      
      const response = NextResponse.json({ success: true, data: issue }, { status: 201 });
      response.headers.set('X-RateLimit-Limit', '100');
      return response;
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}