import { NextRequest, NextResponse } from 'next/server'
import { logSecurityEvent } from '@/lib/security/config'

interface CSPReport {
  'csp-report': {
    'document-uri': string
    referrer: string
    'violated-directive': string
    'effective-directive': string
    'original-policy': string
    disposition: string
    'blocked-uri': string
    'line-number': number
    'column-number': number
    'source-file': string
    'status-code': number
    'script-sample': string
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')
    
    if (!contentType || !contentType.includes('application/csp-report')) {
      return new NextResponse('Invalid Content-Type', { status: 400 })
    }

    const report: CSPReport = await request.json()
    
    if (!report['csp-report']) {
      return new NextResponse('Invalid CSP report format', { status: 400 })
    }

    const cspReport = report['csp-report']
    
    // Log security event
    logSecurityEvent('csp_violation', {
      documentUri: cspReport['document-uri'],
      violatedDirective: cspReport['violated-directive'],
      blockedUri: cspReport['blocked-uri'],
      sourceFile: cspReport['source-file'],
      lineNumber: cspReport['line-number'],
      columnNumber: cspReport['column-number'],
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      timestamp: new Date().toISOString()
    })

    // In production, you might want to:
    // 1. Store in database for analysis
    // 2. Send to monitoring service (Sentry, DataDog, etc.)
    // 3. Alert on critical violations
    
    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('CSP Report Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Only allow POST requests
export async function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 })
}

export async function PUT() {
  return new NextResponse('Method Not Allowed', { status: 405 })
}

export async function DELETE() {
  return new NextResponse('Method Not Allowed', { status: 405 })
} 