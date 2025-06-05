import { createServerPostService } from '@/lib/services/post-service-server'
import { HomePageClient } from '@/components/home-page-client'
import { PostsLoading } from '@/components/posts-loading'
import { Suspense } from 'react'

async function PostsData() {
  // Fetch published posts using basic method for better performance
  const postService = await createServerPostService()
  
  try {
    const postsResponse = await postService.getPublishedPostsBasic(15, 0)
    
    return (
      <HomePageClient 
        initialPosts={postsResponse.data} 
        user={null} // Nie używamy już tego prop, ale zachowujemy dla kompatybilności
      />
    )
  } catch (error) {
    console.error('Error fetching posts:', error)
    return (
      <HomePageClient 
        initialPosts={[]} 
        user={null}
      />
    )
  }
}

export default function HomePage() {
  return (
    <Suspense fallback={<PostsLoading />}>
      <PostsData />
    </Suspense>
  )
}
