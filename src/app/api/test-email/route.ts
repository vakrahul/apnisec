// src/app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  // 1. Check if Key exists
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing RESEND_API_KEY in .env file" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    // 2. Send the email
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'vakitirahul@gmail.com', // <--- CHANGE THIS TO YOUR REAL EMAIL
      subject: 'Test Email from ApniSec Backend',
      html: '<h1>Success!</h1><p>Resend is working correctly.</p>'
    });

    if (data.error) {
        return NextResponse.json({ success: false, error: data.error }, { status: 400 });
    }

    // 3. Success
    return NextResponse.json({ success: true, data });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}