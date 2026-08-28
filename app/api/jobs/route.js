export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const employmentType = searchParams.get('employmentType');
    const experienceLevel = searchParams.get('experienceLevel');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const where = {
      status: 'PUBLISHED', // Default to published jobs
    };

    if (category) where.category = category;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (employmentType) where.employmentType = employmentType;
    if (experienceLevel) where.experienceLevel = experienceLevel;

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { company: true },
        orderBy: { postedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    const paginate = searchParams.get('paginate') === 'true';

    if (paginate) {
      return NextResponse.json({
        jobs,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
      });
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

import { getOrCreateUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getOrCreateUser();
    if (!user || user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.companies || user.companies.length === 0) {
      return NextResponse.json({ error: 'You must create a company profile first' }, { status: 400 });
    }

    const data = await request.json();
    
    const job = await prisma.job.create({
      data: {
        ...data,
        status: 'PUBLISHED',
        companyId: user.companies[0].id
      },
    });
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
