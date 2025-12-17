import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export async function POST(req: NextRequest) {
  const { token, password } = (await req.json()) as {
    token?: string;
    password?: string;
  };

  if (!token || !password) {
    return NextResponse.json(
      { error: 'Token and new password are required.' },
      { status: 400 }
    );
  }

  if (!strongPasswordRegex.test(password)) {
    return NextResponse.json(
      {
        error:
          'Password must contain at least one uppercase letter, one number, and one special character and be at least 8 characters long.'
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const now = new Date();
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: now }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'This reset link is invalid or has expired.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    user.passwordHash = passwordHash;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return NextResponse.json(
      { message: 'Password updated successfully. You can now sign in.' },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Reset password error', error);
    return NextResponse.json(
      { error: 'Something went wrong while resetting the password.' },
      { status: 500 }
    );
  }
}
