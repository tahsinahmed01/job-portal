export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getOrCreateUser();
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'RECRUITER')) {
      return NextResponse.json({ count: 0 });
    }

    let count = 0;

    if (user.role === 'ADMIN') {
      count = await prisma.job.count({
        where: { status: 'PENDING' },
      });
    } else if (user.role === 'RECRUITER') {
      count = await prisma.job.count({
        where: {
          status: 'PENDING',
          company: {
            ownerId: user.id
          }
        },
      });
    }

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching pending jobs count:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
