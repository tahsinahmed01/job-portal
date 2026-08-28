export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized or User not found' }, { status: 401 });
    }

    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      include: {
        job: {
          include: {
            company: true,
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized or User not found' }, { status: 401 });
    }

    const { jobId, resumeLink, coverLetter } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    // Check for duplicate application
    const existing = await prisma.application.findFirst({
      where: {
        userId: user.id,
        jobId: parseInt(jobId),
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'You have already applied for this job.' }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        userId: user.id,
        jobId: parseInt(jobId),
        resumeLink,
        coverLetter,
        status: 'PENDING',
      },
    });
    
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
