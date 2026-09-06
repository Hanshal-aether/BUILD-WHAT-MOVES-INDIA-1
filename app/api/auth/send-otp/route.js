const prisma = require('../../../../lib/prisma');
import { NextResponse } from 'next/server';
const nodemailer = require('nodemailer');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otp.create({
      data: { phone: email, code, expiresAt },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Ration Saathi" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your Ration Saathi verification code',
      text: `Your verification code is ${code}. It expires in 5 minutes.`,
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error('send-otp error:', err);
    return NextResponse.json({ error: 'Could not send the code right now. Please try again.' }, { status: 500 });
  }
}