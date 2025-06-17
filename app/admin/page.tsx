import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/supabase'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AdminPageClient } from '@/components/admin-page-client'
import { LoadingCard } from '@/components/ui/loading-card'

export default async function AdminPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  // Fetch dashboard data
  const [
    { data: posts, count: postsCount },
    { data: categories },
    { data: recentPosts }
  ] = await Promise.all([
    supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('categories')
      .select('*')
      .order('name'),
    supabase
      .from('posts')
      .select(`
        id,
        title,
        status,
        created_at,
        view_count,
        is_featured
      `)
      .order('created_at', { ascending: false })
      .limit(10)
  ])

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingCard />}>
        <AdminPageClient 
          user={user}
          initialData={{
            posts: posts || [],
            postsCount: postsCount || 0,
            categories: categories || [],
            recentPosts: recentPosts || []
          }}
        />
      </Suspense>
    </div>
  )
}
