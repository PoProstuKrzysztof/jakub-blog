import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// Rate limiting store (w produkcji użyj Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// CSRF token store (w produkcji użyj Redis/database)
const csrfTokens = new Set<string>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown'
  return `rate_limit:${ip}`
}

function isRateLimited(key: string, limit: number = 500, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }
  
  if (record.count >= limit) {
    return true
  }
  
  record.count++
  return false
}

function validateRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent')
  const contentType = request.headers.get('content-type')
  
  // Blokuj podejrzane User-Agents
  if (!userAgent || userAgent.length < 10 || /bot|crawler|spider|scraper/i.test(userAgent)) {
    return false
  }
  
  // Waliduj Content-Type dla POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    if (!contentType || (!contentType.includes('application/json') && !contentType.includes('multipart/form-data'))) {
      return false
    }
  }
  
  return true
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  )
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // HSTS (tylko w produkcji)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  return response
}

export async function middleware(request: NextRequest) {
  // Skip rate limiting for login page and static assets
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isStaticAsset = request.nextUrl.pathname.startsWith('/_next') || 
                       request.nextUrl.pathname.includes('.') ||
                       request.nextUrl.pathname.startsWith('/favicon')
  
  // Skip rate limiting in development mode
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (!isLoginPage && !isStaticAsset && !isDevelopment) {
    // Rate limiting with more generous limits
    const rateLimitKey = getRateLimitKey(request)
    if (isRateLimited(rateLimitKey, 2000, 15 * 60 * 1000)) { // 2000 requests per 15 minutes
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': '300' // 5 minutes
        }
      })
    }
  }
  
  // Skip request validation for login and auth routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/admin/login') || 
                     request.nextUrl.pathname.startsWith('/auth')
  
  if (!isAuthRoute && !isStaticAsset) {
    // Request validation
    if (!validateRequest(request)) {
      return new NextResponse('Bad Request', { status: 400 })
    }
  }
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
              })
            )
          } catch {
            // Ignore cookie errors in middleware
          }
        },
      },
    }
  )

  // Auth check for protected routes (excluding login page)
  const protectedPaths = ['/admin']
  const customerPath = request.nextUrl.pathname.startsWith('/portfel-autora')

  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path) && 
    !request.nextUrl.pathname.startsWith('/admin/login')
  )

  // Ochrona trasy portfela autora
  if (customerPath) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      return NextResponse.redirect(loginUrl)
    }

    const { data: hasAccess } = await supabase.rpc('has_product', { p_slug: 'portfolio-access' })
    if (!hasAccess) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/wpisy'
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Ochrona tras administratorskich (jak wcześniej)
  if (isProtectedPath) {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_active || profile.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Add security headers
  response = addSecurityHeaders(response)
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 