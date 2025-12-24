import { IssueService } from '@/lib/IssueService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  
  // ✅ FIX: Use getInstance()
  const service = IssueService.getInstance(); 
  
  const newIssue = await service.createIssue(body);
  return NextResponse.json(newIssue);
}