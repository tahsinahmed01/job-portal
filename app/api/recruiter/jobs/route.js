export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getOrCreateUser();
    
    if (!user || user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobs = await prisma.job.findMany({
      where: {
        company: {
          ownerId: user.id
        }
      },
      include: {
        applications: {
          include: {
            user: true
          },
          orderBy: { appliedAt: 'desc' }
        },
        company: true
      },
      orderBy: { postedAt: 'desc' },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
