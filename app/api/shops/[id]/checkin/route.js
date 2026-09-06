import { NextResponse } from 'next/server';
const prisma = require('../../../../../lib/prisma');

// A shop staff member checks someone in by either their booking code
// ("RS-4K7A29") or their phone number — deliberately two ways in, because
// in tier-3/rural counters a citizen may not have their phone screen handy
// but will remember (or have written down) one of the two.
export async function POST(req, { params }) {
  try {
    const { code, phone, action } = await req.json();
    if (!code && !phone) {
      return NextResponse.json({ error: 'Provide a booking code or phone number' }, { status: 400 });
    }

    const slot = await prisma.timeSlot.findFirst({
      where: {
        shopId: params.id,
        status: 'booked',
        ...(code ? { bookingCode: code.trim().toUpperCase() } : {}),
        ...(phone && !code ? { citizen: { phone: phone.trim() } } : {}),
      },
      include: { citizen: true },
      orderBy: { date: 'asc' },
    });

    if (!slot) {
      return NextResponse.json(
        { error: 'No active booking found at this shop for that code/number' },
        { status: 404 }
      );
    }

    const newStatus = action === 'no_show' ? 'no_show' : 'checked_in';

    const updated = await prisma.timeSlot.update({
      where: { id: slot.id },
      data: {
        status: newStatus,
        checkedInAt: newStatus === 'checked_in' ? new Date() : null,
      },
    });

    return NextResponse.json({
      ...updated,
      citizenName: slot.citizen?.name || null,
      citizenPhone: slot.citizen?.phone || null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Check-in failed' }, { status: 500 });
  }
}
