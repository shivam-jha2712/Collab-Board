// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   // Routes that can be accessed while signed out
//   publicRoutes: ["/anyone-can-visit-this-route"],
//   // Routes that can always be accessed, and have
//   // no authentication information
//   ignoredRoutes: ["/no-auth-in-this-route"],
// });

// export const config = {
//   // Protects all routes, including api/trpc.
//   // See https://clerk.com/docs/references/nextjs/auth-middleware
//   // for more information about configuring your Middleware
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// // Note: Middleware is one of the type of reserved filenames in Typescript thus if you change it then it can cause you some problems.

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define routes that should be PUBLIC (accessible to everyone)
// Make sure to include your sign-in/sign-up pages here!
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/' // Add this if you want the home page to be public
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. Protect everything that is NOT public
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};