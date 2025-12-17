import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function POST(req: NextRequest) {
  const { name, email, password } = (await req.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'Name, email and password are required.' },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password should be at least 8 characters long.' },
      { status: 400 }
    );
  }

  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  if (!strongPasswordRegex.test(password)) {
    return NextResponse.json(
      {
        error:
          'Password must contain at least one uppercase letter, one number, and one special character.'
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const normalisedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalisedEmail });

    const passwordHash = await bcrypt.hash(password, 10);

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    if (existing) {
      if (existing.isVerified) {
        return NextResponse.json(
          { error: 'An account with this email already exists.' },
          { status: 409 }
        );
      }

      existing.name = name;
      existing.passwordHash = passwordHash;
      existing.emailVerificationToken = verificationCode;
      existing.emailVerificationExpires = expires;
      await existing.save();
    } else {
      await User.create({
        name,
        email: normalisedEmail,
        passwordHash,
        isVerified: false,
        emailVerificationToken: verificationCode,
        emailVerificationExpires: expires
      });
    }

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
          subject: 'Verify your AURALEEN account',
          html: `
            <p>Welcome to AURALEEN.</p>
            <p>Your email verification code is:</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${verificationCode}</p>
            <p>This code will expire in 15 minutes.</p>
          `
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error sending signup OTP email', error);
        return NextResponse.json(
          {
            message:
              'Account created but verification email could not be sent. Use the code shown to verify in development.',
            requiresVerification: true,
            devCode: verificationCode
          },
          { status: 201 }
        );
      }
    }

    return NextResponse.json(
      {
        message:
          'Account created. We have sent a 6-digit code to your email to verify your account.',
        requiresVerification: true
      },
      { status: 201 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Signup error', error);
    return NextResponse.json(
      { error: 'Something went wrong while creating the account.' },
      { status: 500 }
    );
  }
}
