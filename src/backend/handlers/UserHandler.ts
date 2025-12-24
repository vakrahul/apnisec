import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';

export class UserHandler {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async getProfile(req: NextRequest) {
    // 1. Extract Token
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      // 2. Decode Token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      
      // 3. Fetch User (Exclude password)
      const user = await this.userRepo.findById(decoded.userId);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      // Return only safe data
      return NextResponse.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }
  }
}