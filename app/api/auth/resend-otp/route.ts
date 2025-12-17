import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const normalisedEmail = email.toLowerCase();

  try {
    await connectDB();

    const user = await User.findOne({ email: normalisedEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found for this email.' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: 'This account is already verified.' },
        { status: 400 }
      );
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    user.emailVerificationToken = verificationCode;
    user.emailVerificationExpires = expires;
    await user.save();

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const userName = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM;

    if (host && port && userName && pass && from) {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: {
          user: userName,
          pass
        }
      });

      try {
        await transporter.sendMail({
          from,
          to: normalisedEmail,
          subject: 'Your AURALEEN verification code',
          html: `
            <p>Your new AURALEEN verification code is:</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${verificationCode}</p>
            <p>This code will expire in 15 minutes.</p>
          `
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error resending signup OTP email', error);
        return NextResponse.json(
          {
            message:
              'Verification code regenerated, but email could not be sent. Use the code shown to verify in development.',
            devCode: verificationCode
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      { message: 'A new verification code has been sent to your email.' },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Resend OTP error', error);
    return NextResponse.json(
      { error: 'Something went wrong while resending the verification code.' },
      { status: 500 }
    );
  }
}
