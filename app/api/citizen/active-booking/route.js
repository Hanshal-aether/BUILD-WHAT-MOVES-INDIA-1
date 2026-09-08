import { NextResponse } from 'next/server';
const prisma = require('../../../../lib/prisma');

// The single source of truth for "does this citizen currently have an
// active booking" — deliberately queries status: 'booked' only, so the
// moment a shop dealer checks someone in (status -> 'checked_in') or marks
// a no-show, this correctly stops returning that slot. The citizen-side
// banner was previously falling back to a localStorage snapshot taken at
// booking time, which never updated after check-in — this route is what
// that fallback should never actually be needed for.
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = (searchParams.get('phone') || '').trim();

    if (!phone) {
      return NextResponse.json({ found: false, error: 'phone is required' }, { status: 400 });
    }

    const citizen = await prisma.citizen.findUnique({ where: { phone } });
    if (!citizen) {
      return NextResponse.json({ found: false });
    }

    const slot = await prisma.timeSlot.findFirst({
      where: { citizenId: citizen.id, status: 'booked' },
      include: { shop: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    if (!slot) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      shopId: slot.shopId,
      shopName: slot.shop.name,
      slotId: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      bookingCode: slot.bookingCode,
      status: slot.status,
    });
  } catch (err) {
    console.error('active-booking lookup error:', err);
    return NextResponse.json({ found: false, error: 'lookup failed' }, { status: 500 });
  }
}
