import { NextResponse } from 'next/server';
const prisma = require('../../../../lib/prisma');

// Verification-officer view: every application across all citizens, newest
// activity first. In production this would sit behind real officer auth and
// be scoped to their jurisdiction/state — kept open here since this is a
// hackathon demo of the workflow, not a production backend.
export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      include: { citizen: true, history: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(applications);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
