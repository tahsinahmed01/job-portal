export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const user = await getOrCreateUser();
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const { status } = await request.json();

    const job = await prisma.job.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
