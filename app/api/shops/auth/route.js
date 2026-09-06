import { NextResponse } from 'next/server';
const prisma = require('../../../../lib/prisma');

// Demo-grade auth: a shop-wide code + PIN (e.g. printed on a card kept at
// the counter), not a full per-employee account system. Good enough for a
// single shared terminal/phone at a ration shop; a production version
// would issue per-dealer credentials tied to the PDS dealer license.
export async function POST(req) {
  try {
    const { loginCode, pin } = await req.json();
    if (!loginCode || !pin) {
      return NextResponse.json({ error: 'Shop code and PIN are required' }, { status: 400 });
    }

    const shop = await prisma.fairPriceShop.findUnique({
      where: { loginCode: loginCode.trim().toUpperCase() },
    });

    if (!shop || shop.pin !== pin.trim()) {
      return NextResponse.json({ error: 'Incorrect shop code or PIN' }, { status: 401 });
    }

    return NextResponse.json({ id: shop.id, name: shop.name, address: shop.address });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
