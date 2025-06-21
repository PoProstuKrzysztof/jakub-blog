import type { AnalysisDto } from '@/lib/actions/portfolio-actions'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface Props {
  analysis: AnalysisDto
}

export function AnalysisCard({ analysis }: Props) {
  return (
    <article className="rounded-md border bg-card p-4 shadow-sm">
      <h3 className="text-lg font-semibold leading-snug">{analysis.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {format(new Date(analysis.createdAt), 'PPP', { locale: pl })}
      </p>
      {analysis.content && (
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: analysis.content }} />
      )}
      {analysis.attachmentUrl && (
        <a
          href={analysis.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex text-primary hover:underline"
        >
          Pobierz załącznik
        </a>
      )}
    </article>
  )
} 