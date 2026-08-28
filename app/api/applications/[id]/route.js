import { NextResponse } from 'next/server';
const prisma = require('../../../../lib/prisma');

export async function GET(req, { params }) {
  try {
    const application = await prisma.application.findUnique({ where: { id: params.id } });
    if (!application) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(application);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.formData ? { formData: JSON.stringify(body.formData) } : {}),
      },
    });
    return NextResponse.json(application);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
