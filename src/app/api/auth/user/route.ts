import { NextResponse } from "next/server";
// @ts-ignore
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validate Input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Find User in DB
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Check if user exists and password matches
    // (Note: In production, you must use bcrypt.compare here)
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 4. SUCCESS: Return the User ID
    return NextResponse.json(
      { message: "Login successful", user: user },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}