import { NextResponse } from 'next/server';
import { AuthService, AppError } from '@/lib/AuthService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const authService = new AuthService();
    
    // Call the REAL login logic
    const result = await authService.login(body);
    
    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}