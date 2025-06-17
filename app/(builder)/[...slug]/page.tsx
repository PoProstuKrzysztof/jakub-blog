import {
  Content,
  fetchOneEntry,
  getBuilderSearchParams,
} from '@builder.io/sdk-react-nextjs'
import { builderApiKey } from '@/lib/builder.io/builder'
import { notFound } from 'next/navigation'

export const revalidate = 60 // ISR – odśwież treść co 60 s

interface PageProps {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export default async function BuilderCatchAllPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  
  const urlPath = '/' + resolvedParams.slug.join('/')

  const content = await fetchOneEntry({
    model: 'page',
    apiKey: builderApiKey,
    options: getBuilderSearchParams(resolvedSearchParams),
    userAttributes: { urlPath },
  })

  if (!content) return notFound()

  return (
    <Content
      model="page"
      apiKey={builderApiKey}
      content={content}
    />
  )
} 