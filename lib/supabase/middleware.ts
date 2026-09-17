import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const path = request.nextUrl.pathname;

  // Protected paths check
  const isVendorPath = path.startsWith('/vendor');
  const isCustomerPath = path.startsWith('/customer');
  const isAdminPath = path.startsWith('/admin');

  // Active role cookie or header check for quick demo/local RBAC testing
  const userRole = request.cookies.get('user_role')?.value || 'super_admin';

  if (isVendorPath && userRole !== 'vendor' && userRole !== 'super_admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (isCustomerPath && userRole !== 'customer' && userRole !== 'super_admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (isAdminPath && userRole === 'vendor') {
    return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
  }

  if (isAdminPath && userRole === 'customer') {
    return NextResponse.redirect(new URL('/customer/dashboard', request.url));
  }

  return response;
}
