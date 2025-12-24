import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma'; 
// FIX: Changed import to relative path (assuming it's in the same src/lib folder)
import { EmailService } from './EmailService'; 

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class AuthService {
  private secret = process.env.JWT_SECRET || 'dev_secret';
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  // --- REGISTER ---
  async register(data: any) {
    const { name, email, password } = data;

    if (!email || !password || !name) {
      throw new AppError("Missing required fields", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError("User already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // Try sending email, but don't crash if it fails
    try {
        if (newUser.email && newUser.name) {
            await this.emailService.sendWelcomeEmail(newUser.email, newUser.name);
        }
    } catch (e) { console.error("Email failed", e); }

    const token = this.generateToken(newUser);

    return {
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token,
    };
  }

  // --- LOGIN ---
  async login(data: any) {
    const { email, password } = data;

    // 1. Find User in DB
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid credentials', 401);

    // 2. Check Password
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError('Invalid credentials', 401);

    // 3. Generate Token
    const token = this.generateToken(user);

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }

  private generateToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      this.secret,
      { expiresIn: '1d' }
    );
  }
}