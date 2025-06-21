import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/supabase-server'
import { supabaseAdmin } from '@/lib/supabase/supabase-admin'

/**
 * GET /api/admin/test-auth - Test endpoint to verify admin API configuration
 */
export async function GET() {
  try {
    console.log('Testing admin auth...')
    
    // Test 1: Check if service key is available
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    console.log('Has service key:', hasServiceKey)
    
    if (!hasServiceKey) {
      return NextResponse.json({
        error: 'SERVICE_ROLE_KEY not found in environment variables',
        hasServiceKey: false
      }, { status: 500 })
    }

    // Test 2: Try to list users with admin API
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1
    })

    if (error) {
      console.error('Admin API error:', error)
      return NextResponse.json({
        error: `Admin API Error: ${error.message}`,
        hasServiceKey: true,
        adminApiWorking: false,
        details: error
      }, { status: 500 })
    }

    console.log('Admin API working, found', users?.length || 0, 'users')

    return NextResponse.json({
      success: true,
      hasServiceKey: true,
      adminApiWorking: true,
      userCount: users?.length || 0,
      sampleUser: users?.[0] ? {
        id: users[0].id,
        email: users[0].email,
        created_at: users[0].created_at
      } : null
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      error: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }, { status: 500 })
  }
}

export async function GET_old(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Test 1: Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      return NextResponse.json({
        success: false,
        error: 'Auth error: ' + authError.message,
        tests: {
          userAuth: { status: 'error', message: authError.message },
          userProfile: { status: 'skipped', message: 'Skipped due to auth error' },
          adminPermissions: { status: 'skipped', message: 'Skipped due to auth error' }
        }
      }, { status: 401 })
    }
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No user found',
        tests: {
          userAuth: { status: 'error', message: 'No user in session' },
          userProfile: { status: 'skipped', message: 'Skipped - no user' },
          adminPermissions: { status: 'skipped', message: 'Skipped - no user' }
        }
      }, { status: 401 })
    }

    const tests: any = {
      userAuth: { status: 'success', message: 'User authenticated', data: { id: user.id, email: user.email } }
    }

    // Test 2: Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_active, created_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      tests.userProfile = { status: 'error', message: profileError.message }
      tests.adminPermissions = { status: 'skipped', message: 'Skipped due to profile error' }
    } else if (!profile) {
      tests.userProfile = { status: 'error', message: 'Profile not found' }
      tests.adminPermissions = { status: 'skipped', message: 'Skipped - no profile' }
    } else {
      tests.userProfile = { 
        status: 'success', 
        message: 'Profile loaded', 
        data: profile 
      }

      // Test 3: Check admin permissions
      if (profile.role === 'admin' && profile.is_active) {
        tests.adminPermissions = { 
          status: 'success', 
          message: 'Full admin permissions',
          data: { role: profile.role, active: profile.is_active }
        }
      } else if (profile.role === 'author' && profile.is_active) {
        tests.adminPermissions = { 
          status: 'warning', 
          message: 'Author permissions (limited)',
          data: { role: profile.role, active: profile.is_active }
        }
      } else {
        tests.adminPermissions = { 
          status: 'error', 
          message: 'Insufficient permissions',
          data: { role: profile.role, active: profile.is_active }
        }
      }
    }

    // Test 4: Test database access
    try {
      const { count: postsCount, error: postsError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })

      if (postsError) {
        tests.databaseAccess = { status: 'error', message: 'Database error: ' + postsError.message }
      } else {
        tests.databaseAccess = { 
          status: 'success', 
          message: 'Database accessible',
          data: { postsCount }
        }
      }
    } catch (dbError: any) {
      tests.databaseAccess = { status: 'error', message: 'Database exception: ' + dbError.message }
    }

    // Test 5: Test refresh token handling
    try {
      const { data: session } = await supabase.auth.getSession()
      
      if (session.session) {
        const now = Math.floor(Date.now() / 1000)
        const expiresAt = session.session.expires_at
        const timeLeft = expiresAt ? Math.floor((expiresAt - now) / 60) : 0
        
        tests.sessionState = {
          status: timeLeft > 5 ? 'success' : 'warning',
          message: `Session expires in ${timeLeft} minutes`,
          data: {
            expiresAt: expiresAt ? new Date(expiresAt * 1000).toISOString() : null,
            timeLeftMinutes: timeLeft
          }
        }
      } else {
        tests.sessionState = { status: 'error', message: 'No session found' }
      }
    } catch (sessionError: any) {
      tests.sessionState = { status: 'error', message: 'Session error: ' + sessionError.message }
    }

    const allPassed = Object.values(tests).every((test: any) => test.status === 'success')
    const hasWarnings = Object.values(tests).some((test: any) => test.status === 'warning')

    return NextResponse.json({
      success: allPassed,
      status: allPassed ? 'all_passed' : hasWarnings ? 'warnings' : 'errors',
      timestamp: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        lastSignIn: user.last_sign_in_at
      },
      tests
    })

  } catch (error: any) {
    console.error('Test auth API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Unexpected error: ' + error.message,
      timestamp: new Date().toISOString(),
      tests: {
        general: { status: 'error', message: 'Unexpected error: ' + error.message }
      }
    }, { status: 500 })
  }
} 