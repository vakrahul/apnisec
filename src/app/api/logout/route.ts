// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {

  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}