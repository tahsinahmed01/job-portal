export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);
    
    if (isNaN(jobId)) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Verify caller is ADMIN, or is a RECRUITER who owns that job's company
    const isAdmin = user.role === 'ADMIN';
    const isOwnerRecruiter = user.role === 'RECRUITER' && job.company.ownerId === user.id;

    if (!isAdmin && !isOwnerRecruiter) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error updating job status:', error);
    return NextResponse.json({ error: 'Failed to update job status' }, { status: 500 });
  }
}
