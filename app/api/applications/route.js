import { NextResponse } from 'next/server';
const prisma = require('../../../lib/prisma');

const DEMO_PHONE = '9876543210';

async function getOrCreateDemoCitizen(state) {
  let citizen = await prisma.citizen.findUnique({ where: { phone: DEMO_PHONE } });
  if (!citizen) {
    citizen = await prisma.citizen.create({
      data: { phone: DEMO_PHONE, name: 'Ravi Kumar', state: state || 'Maharashtra' },
    });
  }
  return citizen;
}

export async function GET() {
  try {
    const citizen = await getOrCreateDemoCitizen();
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
    const { applicationType, state, formData } = body;

    if (!applicationType) {
      return NextResponse.json({ error: 'applicationType is required' }, { status: 400 });
    }

    const citizen = await getOrCreateDemoCitizen(state);

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
