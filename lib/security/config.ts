/**
 * Security Configuration
 * Centralized security settings and environment variable validation
 */

interface SecurityConfig {
  rateLimit: {
    max: number
    windowMs: number
    skipSuccessfulRequests: boolean
    skipFailedRequests: boolean
  }
  csrf: {
    enabled: boolean
    secret: string
  }
  session: {
    timeout: number
    secure: boolean
    httpOnly: boolean
    sameSite: 'strict' | 'lax' | 'none'
  }
  upload: {
    maxFileSize: number
    allowedTypes: string[]
    uploadPath: string
  }
  headers: {
    hsts: {
      maxAge: number
      includeSubDomains: boolean
      preload: boolean
    }
    csp: {
      reportUri?: string
      reportOnly: boolean
    }
  }
  auth: {
    passwordMinLength: number
    requireMFA: boolean
    sessionTimeout: number
  }
}

function validateEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function validateNumericEnvVar(name: string, defaultValue: number): number {
  const value = process.env[name]
  if (!value) return defaultValue
  
  const numValue = parseInt(value, 10)
  if (isNaN(numValue)) {
    throw new Error(`Invalid numeric environment variable: ${name}`)
  }
  return numValue
}

function validateBooleanEnvVar(name: string, defaultValue: boolean): boolean {
  const value = process.env[name]
  if (!value) return defaultValue
  
  return value.toLowerCase() === 'true'
}

// Validate critical environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`)
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
})

// Security configuration
export const securityConfig: SecurityConfig = {
  rateLimit: {
    max: validateNumericEnvVar('RATE_LIMIT_MAX', 100),
    windowMs: validateNumericEnvVar('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 minutes
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },
  csrf: {
    enabled: validateBooleanEnvVar('CSRF_ENABLED', true),
    secret: validateEnvVar('CSRF_SECRET', 'default-csrf-secret-change-in-production')
  },
  session: {
    timeout: validateNumericEnvVar('SESSION_TIMEOUT', 60 * 60 * 1000), // 1 hour
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  },
  upload: {
    maxFileSize: validateNumericEnvVar('MAX_FILE_SIZE', 5 * 1024 * 1024), // 5MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(','),
    uploadPath: validateEnvVar('UPLOAD_PATH', '/tmp/uploads')
  },
  headers: {
    hsts: {
      maxAge: validateNumericEnvVar('HSTS_MAX_AGE', 31536000), // 1 year
      includeSubDomains: true,
      preload: true
    },
    csp: {
      reportUri: process.env.CSP_REPORT_URI,
      reportOnly: validateBooleanEnvVar('CSP_REPORT_ONLY', false)
    }
  },
  auth: {
    passwordMinLength: validateNumericEnvVar('PASSWORD_MIN_LENGTH', 12),
    requireMFA: validateBooleanEnvVar('REQUIRE_MFA', false),
    sessionTimeout: validateNumericEnvVar('AUTH_SESSION_TIMEOUT', 24 * 60 * 60 * 1000) // 24 hours
  }
}

// Content Security Policy
export const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Needed for Next.js - consider removing in production
    "'unsafe-eval'", // Needed for development - remove in production
    'https://cdn.jsdelivr.net'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Needed for styled-components/CSS-in-JS
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'blob:'
  ],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'wss://*.supabase.co'
  ],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': []
}

// Security headers configuration
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
}

// Trusted domains for external resources
export const trustedDomains = {
  images: [
    'images.unsplash.com',
    'cdn.pixabay.com',
    'via.placeholder.com'
  ],
  scripts: [
    'cdn.jsdelivr.net',
    'unpkg.com'
  ],
  styles: [
    'fonts.googleapis.com',
    'cdn.jsdelivr.net'
  ]
}

// Input validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  slug: /^[a-z0-9-]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  phoneNumber: /^\+?[1-9]\d{1,14}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
}

// Sanitization helpers
export const sanitizeInput = {
  html: (input: string): string => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  },
  
  sql: (input: string): string => {
    return input.replace(/['";\\]/g, '')
  },
  
  filename: (input: string): string => {
    return input.replace(/[^a-zA-Z0-9.-]/g, '_')
  },
  
  slug: (input: string): string => {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
}

// Security logging
export const logSecurityEvent = (event: string, details: Record<string, any>) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    severity: 'security'
  }
  
  if (process.env.NODE_ENV === 'production') {
    // In production, send to monitoring service
    console.log(JSON.stringify(logEntry))
  } else {
    console.warn('🔒 Security Event:', logEntry)
  }
}

export default securityConfig 