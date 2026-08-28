import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function getOrCreateUser() {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    return null;
  }

  let user = await prisma.user.findUnique({ where: { clerkId }, include: { companies: true } });
  
  const client = await clerkClient();

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;
    
    const defaultRole = clerkUser.publicMetadata?.role || 'CANDIDATE';
    
    user = await prisma.user.create({
      data: {
        clerkId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'New User',
        role: defaultRole,
      },
      include: { companies: true }
    });

    if (clerkUser.publicMetadata?.role !== defaultRole) {
      await client.users.updateUserMetadata(clerkId, {
        publicMetadata: { role: defaultRole }
      });
    }
  } else {
    // Lazy sync: if manual DB edits occurred, sync them back to Clerk
    const clerkUser = await currentUser();
    if (clerkUser && clerkUser.publicMetadata?.role !== user.role) {
      await client.users.updateUserMetadata(clerkId, {
        publicMetadata: { role: user.role }
      });
    }
  }

  return user;
}
