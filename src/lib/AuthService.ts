import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { EmailService } from './EmailService';
import { AppError } from './AppError';

export class AuthService {
  private secret = process.env.JWT_SECRET || 'dev_secret';
  private emailService: EmailService;

  // PUBLIC CONSTRUCTOR (Simple)
  constructor() {
    this.emailService = new EmailService();
  }

  async login(data: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid credentials', 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError('Invalid credentials', 401);

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      this.secret,
      { expiresIn: '1d' }
    );

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }

  async register(data: any) {
    const { name, email, password } = data;

    if (!email || !password || !name) throw new AppError("Missing fields", 400);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError("User already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    try {
        if (newUser.email) await this.emailService.sendWelcomeEmail(newUser.email, newUser.name || '');
    } catch (e) { console.error("Email failed", e); }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      this.secret,
      { expiresIn: '1d' }
    );

    return {
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token,
    };
  }
}