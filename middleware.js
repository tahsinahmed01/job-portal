import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/post-job(.*)',
  '/admin(.*)'
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  if (isAdminRoute(req)) {
    const { sessionClaims, userId } = await auth();
    
    // Log the claims to the terminal so we can inspect them
    console.log("\n=== Clerk Session Claims ===");
    console.log(sessionClaims);
    console.log("============================\n");

    // Clerk Core 3 stores public metadata on sessionClaims.publicMetadata or metadata
    let role = sessionClaims?.metadata?.role || sessionClaims?.publicMetadata?.role;
    
    // If the role isn't in the session token (because of missing Dashboard config), 
    // fetch it directly from the Clerk API as a fallback.
    if (!role && userId) {
      console.log("Role not found in session token. Fetching user directly from Clerk API...");
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      role = user.publicMetadata?.role;
    }
    
    if (role !== 'ADMIN') {
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
