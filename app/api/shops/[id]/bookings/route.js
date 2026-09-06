import { NextResponse } from 'next/server';
const prisma = require('../../../../../lib/prisma');

// Shop-side view of who booked what. This is the piece that was completely
// missing before: a fair price shop had no way to see who was coming, on
// what day, or how many people to expect.
export async function GET(req, { params }) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date'); // YYYY-MM-DD, optional

    const slots = await prisma.timeSlot.findMany({
      where: {
        shopId: params.id,
        ...(date ? { date } : {}),
      },
      include: { citizen: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    const bookings = slots.map((s) => ({
      id: s.id,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      status: s.status,
      bookingCode: s.bookingCode,
      checkedInAt: s.checkedInAt,
      citizenName: s.citizen?.name || null,
      citizenPhone: s.citizen?.phone || null,
      rationCardNumber: s.citizen?.rationCardNumber || null,
    }));

    const summary = bookings.reduce(
      (acc, b) => {
        acc.total += 1;
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      },
      { total: 0 }
    );

    return NextResponse.json({ bookings, summary });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
