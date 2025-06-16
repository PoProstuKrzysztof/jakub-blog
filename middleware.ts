import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to handle cross-origin requests, security headers, and error prevention
 */

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Handle Builder.io cross-origin requests
  const origin = request.headers.get("origin");
  const builderOrigins = [
    "https://builder.io",
    "https://cdn.builder.io",
    /^https:\/\/.*\.builder\.codes$/,
    /^https:\/\/.*\.builder\.io$/,
  ];

  // Check if origin matches Builder.io patterns
  const isBuilderOrigin =
    origin &&
    builderOrigins.some((pattern) => {
      if (typeof pattern === "string") {
        return origin === pattern;
      }
      return pattern.test(origin);
    });

  // Add CORS headers for Builder.io
  if (isBuilderOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  // Add security headers
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // Add Content Security Policy (CSP) to prevent injection attacks
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.builder.io https://*.builder.codes https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://cdn.builder.io https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com https://cdn.builder.io",
    "connect-src 'self' https://*.supabase.co https://*.supabase.io https://cdn.builder.io https://*.builder.codes https://*.builder.io wss://*.supabase.co",
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://cdn.builder.io https://*.builder.codes",
    "media-src 'self' data: blob: https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self' https://*.builder.codes https://*.builder.io",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // Handle OPTIONS requests for CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: response.headers,
    });
  }

  // Add cache headers for static assets
  if (
    request.nextUrl.pathname.startsWith("/_next/static/") ||
    request.nextUrl.pathname.startsWith("/images/") ||
    request.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );
  }

  // Add no-cache headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Expires", "0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Surrogate-Control", "no-store");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * And include API routes and Builder.io paths
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
    "/(builder|api)/:path*",
  ],
};
