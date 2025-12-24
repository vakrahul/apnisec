import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma'; // Ensure this path matches your project

// --- Interfaces ---
export interface User {
  id: string;
  name: string;
  email: string;
}

export class UserService {
  private secret: string;
  private static instance: UserService;

  // Private constructor for Singleton pattern
  private constructor() {
    this.secret = process.env.JWT_SECRET || 'default-secret-key';
  }

  // Singleton Accessor (Use this to get the service)
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // --- REGISTER (Saves to Database) ---
  public async register(name: string, email: string, password: string) {
    if (!email || !password || !name) {
      throw new Error('Missing required fields: name, email, or password.');
    }

    // 1. Check if user exists in DB
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create User in DB
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Stores hash in 'password' column
      },
    });

    // 4. Generate Token
    const token = this.generateToken(newUser);

    return { 
      user: { id: newUser.id, name: newUser.name, email: newUser.email }, 
      token 
    };
  }

  // --- LOGIN (Reads from Database) ---
  public async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }

    // 1. Find User by Email in DB
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found. Please Register first.');
    }

    // 2. Check Password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    // 3. Generate Token
    const token = this.generateToken(user);

    return { 
      user: { id: user.id, name: user.name, email: user.email }, 
      token 
    };
  }

  // --- HELPER: Token Generation ---
  private generateToken(user: any) {
    return jwt.sign(
      { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      },
      this.secret,
      { expiresIn: '1d' }
    );
  }
}

/**
 * --- LEGACY SUPPORT ---
 * This class exists ONLY to prevent errors in other files that might still 
 * be trying to import 'UserRepository'. You should update those files to 
 * use 'UserService' instead and then delete this class.
 */
export class UserRepository {
  private static instance: UserRepository;

  // This effectively does nothing now, but keeps imports from crashing
  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }
  
  // Shim for findByEmail to prevent crashes if called
  findByEmail(email: string) {
    console.warn("UserRepository.findByEmail is deprecated. Use UserService.");
    return null; 
  }

  // Shim for create
  create(user: any) {
    console.warn("UserRepository.create is deprecated. Use UserService.");
    return user;
  }
}