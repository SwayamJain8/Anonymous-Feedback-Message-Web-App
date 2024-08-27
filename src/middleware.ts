//Import the NextResponse from next/server for the response.
import { NextResponse } from "next/server";

//Import the NextRequest from next/server for the request.
import type { NextRequest } from "next/server";

// Export default the middleware function from next-auth/middleware which means that we are usign middleware everywhere
export { default } from "next-auth/middleware";

//Import the getToken function from next-auth/jwt to get the token.
import { getToken } from "next-auth/jwt";

// This is the mai middleware function that will run on every page.
export async function middleware(request: NextRequest) {
  // Get the token from the request
  const token = await getToken({ req: request });

  // Get the URL from the request
  const url = request.nextUrl;

  // If the token is present and the user is trying to access the sign-in, sign-up, verify or home page, redirect to the dashboard.
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the token is not present and the user is trying to access the dashboard, redirect to the sign
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Return the next response if the above conditions are not met.
  return NextResponse.next();
}

// On which pages should the middleware run
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
