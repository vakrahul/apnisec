import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/EmailService';

// ----------------------------------------------------------------------
// 💡 UNIVERSAL DATABASE MOCK
// (Since we don't have your specific DB connection, this mimics a DB)
// You just need to swap the lines inside the methods below.
// ----------------------------------------------------------------------

export class AuthHandler {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  // ====================================================================
  // 1. REGISTER (With Email Trigger)
  // ====================================================================
  async register(req: NextRequest) {
    try {
      const body = await req.json();
      const { email, name, password } = body;

      // A. Validation
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // B. Check if User Already Exists (Universal Logic)
      // const existingUser = await db.user.findUnique({ where: { email } });
      // if (existingUser) return NextResponse.json({ error: 'User already exists' }, { status: 409 });
      
      // [Simulation]
      if (email === 'duplicate@test.com') {
         return NextResponse.json({ error: 'User already exists' }, { status: 409 });
      }

      // C. Create User
      // const newUser = await db.user.create({ data: { email, name, password } });
      const newUser = { id: 'user_' + Date.now(), email, name, role: 'USER' }; 

      // D. Send Welcome Email (Non-blocking)
      // We don't await this because we want the UI to be fast
      this.emailService.sendWelcomeEmail(email, name)
        .then(() => console.log(`✅ Welcome email sent to ${email}`))
        .catch((err) => console.error(`❌ Failed to send email:`, err));

      return NextResponse.json({ 
        message: 'User registered successfully', 
        user: newUser 
      }, { status: 201 });

    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // ====================================================================
  // 2. LOGIN
  // ====================================================================
  async login(req: NextRequest) {
    try {
      const body = await req.json();
      const { email, password } = body;

      // A. Verify Credentials
      // const user = await db.user.findUnique({ where: { email } });
      // if (!user || !bcrypt.compare(password, user.password)) ...
      
      if (email && password) {
        // [Simulation] Success
        return NextResponse.json({ 
          message: 'Login successful', 
          token: 'mock_jwt_token_123' 
        });
      }

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // ====================================================================
  // 3. LOGOUT
  // ====================================================================
  async logout(req: NextRequest) {
    try {
      // Clear cookies or sessions here
      const response = NextResponse.json({ message: 'Logged out successfully' });
      response.cookies.delete('token'); // Example of universal cleanup
      return response;
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // ====================================================================
  // 4. GET PROFILE
  // ====================================================================
  async getProfile(req: NextRequest) {
    try {
      // Logic to get the current user from session/token
      // const session = await getSession(req);
      // if (!session) throw new Error("Unauthorized");

      return NextResponse.json({ 
        id: 'user_123', 
        name: 'Test User', 
        email: 'test@example.com' 
      });
    } catch (error: any) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
}