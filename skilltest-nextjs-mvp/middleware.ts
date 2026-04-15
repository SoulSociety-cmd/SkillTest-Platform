import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Protected routes
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/test/:path*', '/results/:path*']
}
