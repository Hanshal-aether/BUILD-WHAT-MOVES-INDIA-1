const prisma = require('../../../../lib/prisma');
import { NextResponse } from 'next/server';

// Finds a citizen's current active (booked, not yet checked-in) shop slot —
// used so the "Your booking" card on /shops loads from the real database on
// any device, instead of relying on localStorage set at booking time (which
// a fresh browser/incognito session never has, even though the real booking
// still exists in Postgres).
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
    }

    const citizen = await prisma.citizen.findUnique({ where: { phone } });
    if (!citizen) {
      return NextResponse.json({ found: false });
    }

    const slot = await prisma.timeSlot.findFirst({
      where: { citizenId: citizen.id, status: 'booked' },
      orderBy: { date: 'asc' },
      include: { shop: true },
    });

    if (!slot) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      shopId: slot.shopId,
      shopName: slot.shop?.name || '',
      slotId: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      bookingCode: slot.bookingCode,
    });
  } catch (err) {
    console.error('active-booking lookup error:', err);
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }
}