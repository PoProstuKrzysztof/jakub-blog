import { createClient } from '@/lib/supabase-server'
import { createServerPostService } from '@/lib/services/post-service-server'
import { HomePageClient } from '@/components/home-page-client'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch published posts
  const postService = await createServerPostService() // server-side
  
  try {
    const postsResponse = await postService.getPublishedPosts(50, 0) // Get more posts to have enough for filtering
    
    return (
      <HomePageClient 
        initialPosts={postsResponse.data} 
        user={user}
      />
    )
  } catch (error) {
    console.error('Error fetching posts:', error)
    return (
      <HomePageClient 
        initialPosts={[]} 
        user={user}
      />
    )
  }
}
