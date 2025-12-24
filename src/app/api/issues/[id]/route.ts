import { NextResponse } from 'next/server';
import { IssueService } from '@/lib/IssueService';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Fix for Next.js 15 params
) {
  try {
    // Await params in Next.js 15
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const service = new IssueService();
    service.deleteIssue(id);

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting' }, { status: 500 });
  }
}