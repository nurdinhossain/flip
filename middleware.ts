// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';
 
// export default NextAuth(authConfig).auth;
 
// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };

//middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Bypass all authentication checks
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Maintain existing path exclusions
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}


