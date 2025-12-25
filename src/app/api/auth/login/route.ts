import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/AuthService';
import { AppError } from '@/lib/AppError';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // SIMPLE INSTANTIATION (No getInstance)
    const authService = new AuthService();
    
    const result = await authService.login(body);
    
    const response = NextResponse.json(result, { status: 200 });

    response.cookies.set('auth_token', result.token, {
        httpOnly: true, 
        path: '/',
        maxAge: 86400 
    });
    
    return response;

  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}