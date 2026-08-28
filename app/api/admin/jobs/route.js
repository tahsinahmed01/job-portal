export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getOrCreateUser();
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const jobs = await prisma.job.findMany({
      include: { company: true },
      orderBy: { postedAt: 'desc' }
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
