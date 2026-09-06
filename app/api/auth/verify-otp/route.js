const prisma = require('../../../../lib/prisma');
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const otp = await prisma.otp.findFirst({
      where: { phone: email, verified: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) return NextResponse.json({ error: 'No code found. Please request a new one.' }, { status: 400 });
    if (new Date() > otp.expiresAt) return NextResponse.json({ error: 'This code has expired.' }, { status: 400 });
    if (otp.code !== code.trim()) return NextResponse.json({ error: 'Incorrect code.' }, { status: 401 });

    await prisma.otp.update({ where: { id: otp.id }, data: { verified: true } });
    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error('verify-otp error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}