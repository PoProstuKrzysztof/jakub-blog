import { createServerPostService } from '@/lib/services/post-service-server'
import { HomePageClient } from '@/components/home-page-client'
import { SimpleLoading } from '@/components/simple-loading'
import { Suspense } from 'react'

export const metadata = {
  title: 'Blog - Jakub Inwestycje',
  description: 'Najnowsze artykuły o inwestowaniu i analizie rynków finansowych.',
}

async function getPostsData() {
  const postService = await createServerPostService()
  
  try {
    const postsResponse = await postService.getPublishedPostsBasic(15, 0)
    return postsResponse.data
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPostsData()
  
  return (
    <Suspense fallback={<SimpleLoading />}>
      <HomePageClient 
        initialPosts={posts} 
        user={null} 
      />
    </Suspense>
  )
} 