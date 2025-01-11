// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

// export default clerkMiddleware((auth, request) => {
//   if(!isPublicRoute(request)) {
//     auth().protect();
//   }
// });

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', "/api/(.*)"],
// };



import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define the public routes that should remain accessible without authentication
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/home(.*)', '/about(.*)']);

// Define the middleware
export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // If the route is not public and the user is not authenticated, redirect to the sign-in page
  if (!isPublicRoute(request) && !userId) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/sign-in', // Redirect to the sign-in page if not authenticated
      },
    });
  }

  // Continue to the requested route if the user is authenticated or the route is public
  return new Response(null, { status: 200 });
});

// Configuration for route matching
export const config = {
  matcher: [
    // Match all routes except public ones (sign-in, sign-up, etc.)
    '/((?!sign-in|sign-up|home|about).*|^$)', // Adjust this to match your public routes
    '/api/(.*)', // Ensure API routes are protected too
  ],
};
