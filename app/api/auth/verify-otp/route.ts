import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function POST(req: NextRequest) {
  const { email, code } = (await req.json()) as {
    email?: string;
    code?: string;
  };

  if (!email || !code) {
    return NextResponse.json(
      { error: 'Email and verification code are required.' },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const normalisedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalisedEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found for this email.' },
        { status: 404 }
      );
    }

    if (!user.emailVerificationToken || !user.emailVerificationExpires) {
      return NextResponse.json(
        { error: 'No active verification code. Please sign up again.' },
        { status: 400 }
      );
    }

    const now = new Date();
    if (user.emailVerificationToken !== code || user.emailVerificationExpires < now) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code.' },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: 'Email verified successfully. You can now sign in.' },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Verify OTP error', error);
    return NextResponse.json(
      { error: 'Something went wrong while verifying the code.' },
      { status: 500 }
    );
  }
}
