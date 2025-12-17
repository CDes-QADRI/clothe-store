import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required.' },
      { status: 400 }
    );
  }

  const normalisedEmail = email.toLowerCase();

  try {
    await connectDB();

    const user = await User.findOne({ email: normalisedEmail });

    // Always respond as if it worked to avoid email enumeration
    if (!user) {
      return NextResponse.json(
        {
          message:
            'If an account exists for this email, a reset link has been sent.'
        },
        { status: 200 }
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    await user.save();

    const origin = req.nextUrl.origin;
    const resetUrl = `${origin}/reset-password?token=${token}`;

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
          subject: 'Reset your AURALEEN password',
          html: `
            <p>We received a request to reset your password.</p>
            <p>Click the link below to choose a new password:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link will expire in 30 minutes. If you did not request this, you can ignore this email.</p>
          `
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error sending reset email', error);
        return NextResponse.json(
          {
            message:
              'Reset link generated. Email could not be sent, please contact support.',
            devResetUrl: resetUrl
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          message:
            'If an account exists for this email, a reset link has been sent.'
        },
        { status: 200 }
      );
    }

    // Fallback when SMTP is not configured
    return NextResponse.json(
      {
        message:
          'Reset link generated. SMTP is not configured, so email was not sent.',
        devResetUrl: resetUrl
      },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Forgot password error', error);
    return NextResponse.json(
      { error: 'Something went wrong while starting the reset.' },
      { status: 500 }
    );
  }
}
