import { NextResponse } from 'next/server';
const prisma = require('../../../lib/prisma');

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get('state') || 'Maharashtra';

    const shops = await prisma.fairPriceShop.findMany({
      where: { state },
      orderBy: { name: 'asc' },
      include: {
        timeSlots: {
          where: { isBooked: false },
          orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        },
      },
    });

    return NextResponse.json(shops);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
  }
}
