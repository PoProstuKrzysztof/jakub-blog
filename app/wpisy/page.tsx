import { Suspense } from "react"
import { BlogPageClient } from "@/components/blog-page-client"
import { PostsLoading } from "@/components/posts-loading"
import { createClient } from "@/lib/supabase"
import { PostFull } from "@/lib/models/post"

export const metadata = {
  title: 'Wpisy - Jakub Inwestycje',
  description: 'Najnowsze artykuły o inwestowaniu i analizie rynków finansowych.',
}

async function getPosts(): Promise<PostFull[]> {
  const supabase = createClient()
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      post_categories!inner(
        categories(
          id,
          name,
          slug
        )
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return posts || []
}

async function getUserFromSession() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export default async function WpisyPage() {
  const [posts, user] = await Promise.all([
    getPosts(),
    getUserFromSession(),
  ])

  return (
    <Suspense fallback={<PostsLoading />}>
      <BlogPageClient initialPosts={posts} user={user} />
    </Suspense>
  )
} 