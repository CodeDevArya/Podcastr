// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// //   const isProtectedRoute = createRouteMatcher([
// //     '/sign-in(.*)',
// //     '/sign-up(.*)',
// //     '/discover',
// //     '/podcast',
// //     '/create-podcast',
// //     '/profile',
// //   ]);                             // ----------------- (where we don't go without sign-in)


// const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/'])

// export default clerkMiddleware((auth, req) => {
//   if (!isPublicRoute(req)) auth().protect();
// });                                  // ----------------- (where only we can go without sign-in)

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/'])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};