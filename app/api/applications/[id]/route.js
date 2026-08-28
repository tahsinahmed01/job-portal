export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const user = await getOrCreateUser();

    if (!user || user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Verify the user owns the job for this application
    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) },
      include: {
        job: {
          include: {
            company: true
          }
        }
      }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.job.company.ownerId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to update this application' }, { status: 403 });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { user: true }
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
