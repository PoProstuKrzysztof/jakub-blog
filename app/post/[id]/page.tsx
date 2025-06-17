import { createClient } from '@/lib/supabase-server'
import { createServerPostService } from '@/lib/services/post-service-server'
import { PostPageClient } from '@/components/post-page/post-page-client'
import { notFound } from 'next/navigation'

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = params
  
  // Fetch post from database
  const postService = await createServerPostService() // server-side
  
  try {
    const postResponse = await postService.getPostById(id)
    
    if (!postResponse.data) {
      notFound()
    }

    const post = postResponse.data
    
    // Check if post is published (unless user is admin)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    let isAdmin = false
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      isAdmin = profile?.role === 'admin'
    }
    
    // If post is not published and user is not admin, show 404
    if (post.status !== 'published' && !isAdmin) {
      notFound()
    }

    // Increment view count
    await postService.incrementPostViews(post.slug)
    
    return <PostPageClient post={post} user={user} />
  } catch (error) {
    console.error('Error fetching post:', error)
    notFound()
  }
}
