import { createClient } from '@/lib/supabase/supabase-server'
import { getUserRoleServer, getUserPanelPath } from '@/lib/utils/user-role-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL, otherwise determine based on user role
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      let redirectPath = next
      
      // If no specific redirect path, determine based on user role
      if (!redirectPath) {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const role = await getUserRoleServer(user.id)
            redirectPath = getUserPanelPath(role)
          } else {
            redirectPath = '/panel'
          }
        } catch (roleError) {
          console.error('Error determining user role for redirect:', roleError)
          redirectPath = '/panel' // fallback to user panel
        }
      }
      
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${redirectPath}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
} 