import { withAuth } from 'next-auth/middleware'
import posthog from 'posthog-js'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: false,
    persistence: 'localStorage+cookie',
    loaded: () => {
      posthog.capture('$pageview')
    }
  })
}

export default withAuth(
  function middleware(req) {
    if (posthog.is_active()) {
      posthog.capture('$pageview', {
        $current_url: req.url,
        role: req.nextauth?.token?.role || 'anonymous'
      })
    }
    // Protected routes
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/company')) {
          return !!(token && token.role === 'company');
        }
        return !!token;
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/company/:path*', '/test/:path*', '/results/:path*']
}
