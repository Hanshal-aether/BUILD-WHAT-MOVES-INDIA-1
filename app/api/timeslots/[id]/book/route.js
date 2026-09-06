import { NextResponse } from 'next/server';
const prisma = require('../../../../../lib/prisma');
const { generateBookingCode } = require('../../../../../lib/bookingCode');

async function getOrCreateCitizen(phone, state) {
  let citizen = await prisma.citizen.findUnique({ where: { phone } });
  if (!citizen) {
    citizen = await prisma.citizen.create({
      data: { phone, state: state || 'Maharashtra' },
    });
  }
  return citizen;
}

export async function POST(req, { params }) {
  try {
    const body = await req.json().catch(() => ({}));
    const phone = (body.phone || '').trim();

    if (!phone) {
      return NextResponse.json(
        { error: 'A mobile number is required so the shop can find your booking' },
        { status: 400 }
      );
    }

    const slot = await prisma.timeSlot.findUnique({
      where: { id: params.id },
      include: { shop: true },
    });

    if (!slot) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }
    if (slot.isBooked || slot.status !== 'open') {
      return NextResponse.json({ error: 'This slot has just been booked by someone else' }, { status: 409 });
    }

    const citizen = await getOrCreateCitizen(phone, body.state);

    // Retry a couple of times on the (very unlikely) chance of a code collision.
    let updated;
    for (let attempt = 0; attempt < 3; attempt++) {
      const bookingCode = generateBookingCode();
      try {
        updated = await prisma.timeSlot.update({
          where: { id: params.id },
          data: {
            isBooked: true,
            status: 'booked',
            citizenId: citizen.id,
            bookingCode,
          },
        });
        break;
      } catch (e) {
        if (attempt === 2) throw e;
      }
    }

    return NextResponse.json({
      ...updated,
      shopName: slot.shop.name,
      shopAddress: slot.shop.address,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to book slot' }, { status: 500 });
  }
}
