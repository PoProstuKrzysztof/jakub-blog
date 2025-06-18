// @ts-nocheck
// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async req => {
  const payload = await req.json()
  const record = payload.record as any

  if (!record) {
    return new Response(JSON.stringify({ ok: false }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    })
  }

  // Broadcast w Realtime kanał "analyses"
  await supabase.channel('analyses').send({
    type: 'broadcast',
    event: 'new-analysis',
    payload: {
      id: record.id,
      title: record.title,
      created_at: record.created_at
    }
  })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
}) 