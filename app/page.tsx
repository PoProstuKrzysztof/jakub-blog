import { Suspense } from 'react'
import { createClient } from '@/lib/supabase-server'
import { AuthorPageClient } from '@/components/author-page-client'
import { SimpleLoading } from '@/components/simple-loading'

export const metadata = {
  title: 'Jakub Inwestycje - O Autorze',
  description: 'Poznaj autora bloga Jakub Inwestycje - doświadczenie, wykształcenie i pasja do inwestowania.',
}

async function getAuthorContent() {
  const supabase = await createClient()
  
  try {
    const { data, error } = await supabase
      .from('author_content')
      .select('*')
      .order('section_order', { ascending: true })

    if (error) {
      console.error('Error fetching author content:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getAuthorContent:', error)
    return []
  }
}

async function getCurrentUser() {
  const supabase = await createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export default async function HomePage() {
  const [authorContent, user] = await Promise.all([
    getAuthorContent(),
    getCurrentUser()
  ])

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<SimpleLoading />}>
        <AuthorPageClient 
          initialContent={authorContent}
          user={user}
        />
      </Suspense>
    </div>
  )
}
