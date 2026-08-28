import { NextResponse } from 'next/server';
const prisma = require('../../../lib/prisma');

async function getOrCreateCitizen(phone, state) {
  let citizen = await prisma.citizen.findUnique({ where: { phone } });
  if (!citizen) {
    citizen = await prisma.citizen.create({
      data: { phone, state: state || 'Maharashtra' },
    });
  }
  return citizen;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    if (!phone) {
      return NextResponse.json({ error: 'phone is required' }, { status: 400 });
    }
    const citizen = await getOrCreateCitizen(phone);
    const apps = await prisma.application.findMany({
      where: { citizenId: citizen.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(apps);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { applicationType, state, formData, phone } = body;

    if (!applicationType) {
      return NextResponse.json({ error: 'applicationType is required' }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: 'phone is required' }, { status: 400 });
    }

    const citizen = await getOrCreateCitizen(phone, state);

    const application = await prisma.application.create({
      data: {
        citizenId: citizen.id,
        applicationType,
        state: state || 'Maharashtra',
        status: 'new',
        formData: JSON.stringify(formData || {}),
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}