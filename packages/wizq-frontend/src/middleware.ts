import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserType1 } from './types';

const serviceProviderRoutes = ['/business'];
const homeOwnerRoutes = ['/projects/create'];

export function middleware(request: NextRequest) {
  for (const key of serviceProviderRoutes) {
    if (request.nextUrl.pathname.includes(key)) {
      if (request.cookies.has('userType')) {
        if (request.cookies.get('userType').value === UserType1.HOME_OWNER) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    }
  }

  for (const key of homeOwnerRoutes) {
    if (request.nextUrl.pathname.includes(key)) {
      if (request.cookies.has('userType')) {
        if (request.cookies.get('userType').value === UserType1.SERVICE_PROVIDER) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    }
  }

  return NextResponse.next();
}
