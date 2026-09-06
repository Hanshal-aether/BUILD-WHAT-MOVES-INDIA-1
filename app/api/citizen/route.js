const prisma = require('../../../lib/prisma');
import { NextResponse } from 'next/server';

const PHONE_REGEX = /^[6-9]\d{9}$/;

export async function POST(req) {
  try {
    const { phone, email, rationCardNumber, state } = await req.json();

    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { error: 'Enter a valid 10-digit Indian mobile number' },
        { status: 400 }
      );
    }

    const citizen = await prisma.citizen.upsert({
      where: { phone },
      update: {
        ...(email ? { name: email } : {}),
        ...(rationCardNumber ? { rationCardNumber } : {}),
      },
      create: {
        phone,
        name: email || null,
        rationCardNumber: rationCardNumber || null,
        state: state || 'Maharashtra',
      },
    });

    return NextResponse.json({ citizen });
  } catch (err) {
    console.error('citizen upsert error:', err);
    return NextResponse.json({ error: 'Could not save your details' }, { status: 500 });
  }
}