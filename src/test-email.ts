// test-email.ts
import { Resend } from 'resend';

// REPLACE THIS WITH YOUR REAL API KEY DIRECTLY FOR TESTING
const resend = new Resend('re_gqDdijee_E4s6VAEBYWLkj95Y1DjterVL'); 

async function sendTest() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'vakitirahul@gmail.com', // MUST be the email you signed up with
      subject: 'Test Email from ApniSec',
      html: '<p>If you see this, Resend is working!</p>'
    });
    console.log('✅ Success:', data);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

sendTest();