import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email.toLowerCase() }).lean();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    name: user.name,
    email: user.email,
    contactNumber: user.contactNumber ?? '',
    address: user.address ?? ''
  });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, contactNumber, address } = (await req.json()) as {
    name?: string;
    contactNumber?: string;
    address?: string;
  };

  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email.toLowerCase() });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  user.name = name;
  user.contactNumber = contactNumber ?? '';
  user.address = address ?? '';
  await user.save();

  return NextResponse.json({
    message: 'Profile updated successfully.',
    name: user.name,
    email: user.email,
    contactNumber: user.contactNumber,
    address: user.address
  });
}
