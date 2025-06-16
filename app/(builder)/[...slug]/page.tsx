import {
  Content,
  fetchOneEntry,
  getBuilderSearchParams,
} from '@builder.io/sdk-react-nextjs'
import { builderApiKey } from '@/lib/builder'
import { notFound } from 'next/navigation'

export const revalidate = 60 // ISR – odśwież treść co 60 s

interface PageProps {
  params: { slug: string[] }
  searchParams: Record<string, string | string[]>
}

export default async function BuilderCatchAllPage({ params, searchParams }: PageProps) {
  const urlPath = '/' + params.slug.join('/')

  const content = await fetchOneEntry({
    model: 'page',
    apiKey: builderApiKey,
    options: getBuilderSearchParams(searchParams),
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