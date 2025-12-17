import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/order';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: 'You need to be signed in to place an order.' },
      { status: 401 }
    );
  }

  await connectDB();
  const body = (await req.json()) as {
    name?: string;
    phone?: string;
    city?: string;
    area?: string;
    address?: string;
    subtotal?: number;
    items?: Array<{
      name: string;
      size: string;
      quantity: number;
      price: number;
    }>;
  };

  const { name, phone, city, area, address, subtotal, items } = body;

  if (!name || !phone || !city || !area || !address) {
    return NextResponse.json(
      { error: 'All delivery details are required.' },
      { status: 400 }
    );
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: 'Cart items are required to place an order.' },
      { status: 400 }
    );
  }

  if (typeof subtotal !== 'number' || subtotal <= 0) {
    return NextResponse.json(
      { error: 'Subtotal must be a positive number.' },
      { status: 400 }
    );
  }

  const order = await Order.create({
    userEmail: session.user.email.toLowerCase(),
    customerName: name,
    phone,
    city,
    area,
    address,
    subtotal,
    items
  });

  const pseudoId = 'WK-' + String(order._id).slice(-6).toUpperCase();

  return NextResponse.json(
    {
      id: pseudoId,
      message: 'Order created successfully. Our team will contact you to confirm.'
    },
    { status: 201 }
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const isAdmin = adminEmail && session.user.email.toLowerCase() === adminEmail;

  await connectDB();

  const query = isAdmin ? {} : { userEmail: session.user.email.toLowerCase() };

  const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ orders }, { status: 200 });
}
