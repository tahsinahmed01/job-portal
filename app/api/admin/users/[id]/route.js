export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/auth';
import { clerkClient } from '@clerk/nextjs/server';

export async function PATCH(request, { params }) {
  try {
    const admin = await getOrCreateUser();
    if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const { role } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role }
    });

    const client = await clerkClient();
    await client.users.updateUserMetadata(updatedUser.clerkId, {
      publicMetadata: { role }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
