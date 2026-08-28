export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { getJobs } from '@/lib/getJobs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await getJobs(searchParams);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

import { getOrCreateUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    let status = 'PENDING';
    if (user.role === 'RECRUITER' && user.companies && user.companies.some(c => c.id === parseInt(data.companyId))) {
      status = 'APPROVED';
    }

    const job = await prisma.job.create({
      data: {
        ...data,
        companyId: parseInt(data.companyId),
        status,
        postedById: user.id
      },
    });
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
