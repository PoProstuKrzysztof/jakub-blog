import { createClient } from '../supabase-server'
import { PostService } from './post-service'

// Factory function for creating PostService instances for server-side use
export async function createServerPostService(): Promise<PostService> {
  const serverClient = await createClient()
  return new PostService(serverClient)
} 