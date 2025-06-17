import { Suspense } from "react"
import { HomePageClient } from "@/components/home-page/home-page-client"
import { PostsLoading } from "@/components/post-page/posts-loading"
import { createClient } from "@/lib/supabase"
import { PostFull } from "@/lib/models/post"

export const metadata = {
  title: 'Jakub Inwestycje - Profesjonalne analizy finansowe',
  description: 'Osiągnij finansową niezależność dzięki profesjonalnym analizom spółek, strategiom inwestycyjnym i edukacji finansowej.',
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

export default async function HomePage() {
  const [posts, user] = await Promise.all([
    getPosts(),
    getUserFromSession(),
  ])

  return (
    <Suspense fallback={<PostsLoading />}>
      <HomePageClient initialPosts={posts} user={user} />
    </Suspense>
  )
}
