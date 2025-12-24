// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    // 1. Validate Header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Missing token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // 2. Prevent crashing on "null" string
    if (token === 'null' || token === 'undefined') {
      return NextResponse.json({ message: 'Invalid token format' }, { status: 401 });
    }

    // 3. Decode Token (Universal: Extracts data from WHOEVER logged in)
    const decoded: any = jwt.verify(token, secret);

    return NextResponse.json({
      id: decoded.id,
      name: decoded.name, // Displays the name saved during Registration
      email: decoded.email
    }, { status: 200 });

  } catch (error) {
    console.error("Token Verification Error:", error);
    return NextResponse.json({ message: 'Session expired' }, { status: 401 });
  }
}