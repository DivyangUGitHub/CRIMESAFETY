import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting configuration
const rateLimitMap = new Map();

function rateLimit(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
  const path = request.nextUrl.pathname;
  const key = `${ip}:${path}`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 60; // 60 requests per minute
  
  const requestLog = rateLimitMap.get(key) || [];
  const recentRequests = requestLog.filter((time: number) => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(key, recentRequests);
  return true;
}

// Protected routes configuration
const protectedRoutes = [
  "/dashboard",
  "/reports/new",
  "/reports/edit",
  "/profile",
  "/settings",
];

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/reports",
  "/reports/:path*", // Allow viewing reports without auth
];

const adminRoutes = [
  "/admin",
  "/admin/:path*",
];

const policeRoutes = [
  "/police",
  "/police/:path*",
];

export default withAuth(
  function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = (request as any).nextauth?.token;
    const isAuthenticated = !!token;
    
    // Rate limiting
    if (!rateLimit(request)) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
    
    // Security headers
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );
    
    // Check role-based access
    if (adminRoutes.some(route => path.match(new RegExp(`^${route.replace(/:path\*/, ".*")}$`)))) {
      if (!isAuthenticated || token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
    
    if (policeRoutes.some(route => path.match(new RegExp(`^${route.replace(/:path\*/, ".*")}$`)))) {
      if (!isAuthenticated || (token?.role !== "POLICE" && token?.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
    
    // API rate limiting for sensitive endpoints
    if (path.startsWith("/api/") && request.method === "POST") {
      const sensitiveEndpoints = ["/api/auth", "/api/reports/create", "/api/chat"];
      if (sensitiveEndpoints.some(endpoint => path.includes(endpoint))) {
        // Stricter rate limiting for sensitive APIs
        const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
        const key = `${ip}:sensitive`;
        const now = Date.now();
        const requestLog = rateLimitMap.get(key) || [];
        const recentRequests = requestLog.filter((time: number) => now - time < 60 * 1000);
        
        if (recentRequests.length >= 10) { // 10 requests per minute max
          return new NextResponse("Rate limit exceeded", { status: 429 });
        }
        
        recentRequests.push(now);
        rateLimitMap.set(key, recentRequests);
      }
    }
    
    // Block suspicious paths
    const suspiciousPaths = ["/_next", "/api/_next", "/.env", "/config", "/wp-admin"];
    if (suspiciousPaths.some(susPath => path.includes(susPath))) {
      return new NextResponse("Not Found", { status: 404 });
    }
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Check if route is protected
        const isProtectedRoute = protectedRoutes.some(route => 
          path === route || path.startsWith(`${route}/`)
        );
        
        if (!isProtectedRoute) return true;
        
        // Allow access if authenticated
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
      error: "/unauthorized",
    },
  }
);

// Match all routes except static files and Next.js internals
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};