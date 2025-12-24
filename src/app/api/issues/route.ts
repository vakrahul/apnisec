import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { IssueService } from '@/lib/IssueService';

// Helper: Extract User ID from Token
const getUserId = (req: Request) => {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
  return decoded.id;
};

// 1. GET (Fetch All)
export async function GET(req: Request) {
  try {
    const issueService = IssueService.getInstance();
    const issues = await issueService.getAllIssues();
    return NextResponse.json(issues);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST (Create New)
export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const body = await req.json();
    
    const issueService = IssueService.getInstance();
    
    const newIssue = await issueService.createIssue({
      ...body,
      userId // Attach the user ID from the token
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// 3. PATCH (Update Status) - THIS IS NEW
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body; // Expecting { id: "...", status: "Closed" }

    if (!id || !status) {
      return NextResponse.json({ error: "ID and Status required" }, { status: 400 });
    }

    const issueService = IssueService.getInstance();
    const updatedIssue = await issueService.updateStatus(id, status);

    return NextResponse.json(updatedIssue);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}