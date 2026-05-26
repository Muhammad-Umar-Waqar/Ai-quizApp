import { NextResponse } from 'next/server';

export  function middleware(request) {
  const token = request.cookies.get('token')?.value;
  console.log('Middleware Executed!');

  const { pathname } = request.nextUrl;

  // Paths accessible only to logged-in users
  const loggedOutUserNotAccessPaths = ['/dashboard', '/dashboard/*'];

  // Redirect logged-out users from protected paths
  if (loggedOutUserNotAccessPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/signup', request.url));
    }
  }

  // Paths accessible only to logged-out users
  const loggedInUserNotAccessPaths = [ '/signin', '/signup'];

  // Redirect logged-in users away from non-accessible paths
  if (loggedInUserNotAccessPaths.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/signin',
    '/signup',
    '/dashboard/:path*',
  ],
};
