import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a unique random ID for the link
    const uniqueId = crypto.randomUUID();
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${uniqueId}?name=${encodeURIComponent(name)}`;

    const { data, error } = await resend.emails.send({
      from: 'Document Viewer <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Access Link',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #1e293b;">Analyzer: ${name || 'PDF Analyzer'}</h2>
          <p style="color: #475569; line-height: 1.6;">
            Thank you for requesting access. Click the button below to proceed to your document viewer:
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${verificationLink}" 
               style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Access Portal
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 0.875rem;">
            If the button doesn't work, copy and paste this link into your browser: <br/>
            <span style="color: #6366f1;">${verificationLink}</span>
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #94a3b8; font-size: 0.75rem;">
            This link was requested from the Document Viewer portal. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully', id: data?.id });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
