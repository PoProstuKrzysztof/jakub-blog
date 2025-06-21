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
  const userAgent = request.headers.get('user-agent') || ''
  const contentType = request.headers.get('content-type') || ''
  
  // Blokuj podejrzane user agents
  const suspiciousPatterns = [
    /^$/,
    /curl/i,
    /wget/i,
    /python/i,
    /bot/i,
    /crawler/i,
    /spider/i
  ]

  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    return false
  }
  
  // Sprawdź Content-Type dla żądań POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    if (!contentType.includes('application/json') && 
        !contentType.includes('application/x-www-form-urlencoded') &&
        !contentType.includes('multipart/form-data') &&
        !contentType.includes('text/plain')) {
      return false
    }
  }
  
  return true
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Build Content Security Policy dynamically so that we don't force HTTPS locally in development.
  const cspDirectives: string[] = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Allow Google fonts and inline data URIs for local development icon fonts
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ]

  // Enforce request upgrade only in production where the app is served over HTTPS.
  if (process.env.NODE_ENV === 'production') {
    cspDirectives.push('upgrade-insecure-requests')
  }

  const csp = cspDirectives.join('; ')

  // Security headers
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // HSTS (tylko w produkcji)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }
  
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Pomiń middleware dla zasobów statycznych i API
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') ||
      pathname.includes('.') ||
      pathname === '/favicon.ico' ||
      pathname === '/login' ||
      pathname.startsWith('/auth/')) {
    return addSecurityHeaders(NextResponse.next())
  }

  // Rate limiting (bardziej liberalne limity)
  const rateLimitKey = getRateLimitKey(request)
  if (isRateLimited(rateLimitKey, 1000, 15 * 60 * 1000)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    // Utwórz klienta Supabase dla middleware - tylko do refresh tokenów
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, {
                ...options,
                httpOnly: false, // Pozwól klientowi na dostęp do tokenów
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
              })
            })
          },
        },
      }
    )

    // Sprawdź tylko czy użytkownik jest zalogowany dla chronionych ścieżek
    if (pathname.startsWith('/admin') || pathname.startsWith('/panel') || pathname === '/portfel-autora') {
      // Pozwól stronie /admin sprawdzić autoryzację samodzielnie
      // Nie przekierowuj w middleware, aby uniknąć pętli przekierowań
      console.log('🔧 MIDDLEWARE - Allowing access to protected route:', pathname)
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          console.warn('🔧 MIDDLEWARE - getUser error:', error.message)
        }
        if (user) {
          console.log('🔧 MIDDLEWARE - User found in middleware:', user.id)
        } else {
          console.log('🔧 MIDDLEWARE - No user found in middleware')
        }
      } catch (error) {
        console.warn('🔧 MIDDLEWARE - getUser exception:', error)
      }
    }

  } catch (error) {
    console.error('Middleware error:', error)
    // W przypadku błędu, pozwól przejść dalej
  }


  response = addSecurityHeaders(response)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|auth|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 