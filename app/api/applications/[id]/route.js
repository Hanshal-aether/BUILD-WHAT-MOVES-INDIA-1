import { NextResponse } from 'next/server';
const prisma = require('../../../../lib/prisma');

export async function GET(req, { params }) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: { history: { orderBy: { createdAt: 'asc' } } },
    });
    if (!application) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(application);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

// Every status change is now logged with a note and who made it, instead of
// silently overwriting one field. `note` should carry the actual reason
// (e.g. "Address proof photo is blurry — please re-upload") so a citizen
// sees specifics instead of one generic "there's an issue" message.
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

    if (body.status) {
      await prisma.statusHistory.create({
        data: {
          applicationId: params.id,
          status: body.status,
          note: body.note || null,
          changedBy: body.changedBy || 'system',
        },
      });
    }

    return NextResponse.json(application);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
