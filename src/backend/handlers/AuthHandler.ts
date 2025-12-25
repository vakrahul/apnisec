import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/AuthService';

export class AuthHandler {
  private authService: AuthService;

  constructor() {
    // Initialize the Real Service (Connects to Prisma & JWT)
    this.authService = new AuthService();
  }

  // ====================================================================
  // 1. REGISTER
  // ====================================================================
  async register(req: NextRequest) {
    try {
      const body = await req.json();

      // Call the Service (Handles Validation, DB creation, Password Hashing, Email)
      const result = await this.authService.register(body);

      const response = NextResponse.json({ 
        message: 'User registered successfully',
        success: true, 
        data: result 
      }, { status: 201 });

      // Set Auth Cookie immediately
      response.cookies.set('auth_token', result.token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 1 day
      });

      return response;

    } catch (error: any) {
      // Return specific error message from Service (e.g. "User already exists")
      return NextResponse.json(
        { error: error.message || 'Registration failed' }, 
        { status: error.statusCode || 400 }
      );
    }
  }

  // ====================================================================
  // 2. LOGIN
  // ====================================================================
  async login(req: NextRequest) {
    try {
      const body = await req.json();

      // Call the Service (Handles DB lookup, Password Check, JWT Generation)
      const result = await this.authService.login(body);

      const response = NextResponse.json({ 
        message: 'Login successful',
        success: true, 
        data: result 
      }, { status: 200 });

      // Set Auth Cookie
      response.cookies.set('auth_token', result.token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 1 day
      });

      return response;

    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Login failed' }, 
        { status: error.statusCode || 401 }
      );
    }
  }

  // ====================================================================
  // 3. LOGOUT
  // ====================================================================
  async logout(req: NextRequest) {
    try {
      const response = NextResponse.json({ 
        success: true, 
        message: 'Logged out successfully' 
      });

      // Delete the cookie
      response.cookies.delete('auth_token');
      
      return response;
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}