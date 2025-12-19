import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { getRequestOrigin } from '@/lib/request-origin';
import { sendEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required.' },
      { status: 400 }
    );
  }

  const normalisedEmail = email.toLowerCase();
  const genericMessage =
    'If an account exists for this email, a reset link has been sent.';
  const isDev = process.env.NODE_ENV !== 'production';

  try {
    await connectDB();

    const user = await User.findOne({ email: normalisedEmail });

    // Always respond as if it worked to avoid email enumeration
    if (!user) {
      return NextResponse.json(
        {
          message: genericMessage
        },
        { status: 200 }
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    await user.save();

    const origin = getRequestOrigin(req);
    const resetUrl = `${origin}/reset-password?token=${token}`;

    try {
      await sendEmail({
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
          message: genericMessage,
          ...(isDev ? { devResetUrl: resetUrl } : {})
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: genericMessage
      },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Forgot password error', error);

    const detail =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        message: genericMessage,
        ...(isDev ? { devError: detail } : {})
      },
      { status: 200 }
    );
  }
}
