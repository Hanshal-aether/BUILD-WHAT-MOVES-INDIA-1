import { NextResponse } from 'next/server';
const prisma = require('../../../../../lib/prisma');

export async function POST(req, { params }) {
  try {
    const slot = await prisma.timeSlot.findUnique({
      where: { id: params.id },
      include: { shop: true },
    });

    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }
    if (slot.isBooked) {
      return NextResponse.json({ error: 'This slot has just been booked by someone else' }, { status: 409 });
    }

    const updated = await prisma.timeSlot.update({
      where: { id: params.id },
      data: { isBooked: true },
    });

    return NextResponse.json({
      ...updated,
      shopName: slot.shop.name,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to book slot' }, { status: 500 });
  }
}
