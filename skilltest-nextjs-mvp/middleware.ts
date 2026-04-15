import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {

  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/company")) {
          return !!(token && token.role === "company");
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/company/:path*", "/test/:path*", "/results/:path*"],
};