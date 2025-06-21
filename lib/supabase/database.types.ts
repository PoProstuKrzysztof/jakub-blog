export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attachments: {
        Row: {
          alt_text: string | null
          description: string | null
          file_size: number
          height: number | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          mime_type: string
          original_filename: string
          public_url: string | null
          storage_path: string
          stored_filename: string
          uploaded_at: string | null
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          description?: string | null
          file_size: number
          height?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          mime_type: string
          original_filename: string
          public_url?: string | null
          storage_path: string
          stored_filename: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          description?: string | null
          file_size?: number
          height?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          mime_type?: string
          original_filename?: string
          public_url?: string | null
          storage_path?: string
          stored_filename?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      author_analyses: {
        Row: {
          attachment_url: string | null
          author_id: string
          content: string | null
          created_at: string | null
          id: string
          is_published: boolean
          title: string
        }
        Insert: {
          attachment_url?: string | null
          author_id: string
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean
          title: string
        }
        Update: {
          attachment_url?: string | null
          author_id?: string
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean
          title?: string
        }
        Relationships: []
      }
      author_content: {
        Row: {
          content: string
          content_type: string | null
          created_at: string | null
          id: string
          is_editable: boolean | null
          is_visible: boolean
          page_slug: string | null
          section_identifier: string | null
          section_order: number
          section_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          is_editable?: boolean | null
          is_visible?: boolean
          page_slug?: string | null
          section_identifier?: string | null
          section_order?: number
          section_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          is_editable?: boolean | null
          is_visible?: boolean
          page_slug?: string | null
          section_identifier?: string | null
          section_order?: number
          section_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      author_portfolio: {
        Row: {
          author_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          json_data: Json
        }
        Insert: {
          author_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          json_data: Json
        }
        Update: {
          author_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          json_data?: Json
        }
        Relationships: []
      }
      cache_entries: {
        Row: {
          created_at: string | null
          expires_at: string
          key: string
          tags: string[] | null
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          key: string
          tags?: string[] | null
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          key?: string
          tags?: string[] | null
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          message: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          message: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          message?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          currency: string
          expires_at: string | null
          id: string
          price_cents: number
          product_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          expires_at?: string | null
          id?: string
          price_cents: number
          product_id: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          expires_at?: string | null
          id?: string
          price_cents?: number
          product_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      post_analytics: {
        Row: {
          additional_metrics: Json | null
          analytics_date: string
          average_time_on_page: number | null
          bounce_rate: number | null
          comments_count: number | null
          created_at: string | null
          daily_views: number | null
          id: string
          post_id: string | null
          shares_count: number | null
          unique_visitors: number | null
          updated_at: string | null
        }
        Insert: {
          additional_metrics?: Json | null
          analytics_date: string
          average_time_on_page?: number | null
          bounce_rate?: number | null
          comments_count?: number | null
          created_at?: string | null
          daily_views?: number | null
          id?: string
          post_id?: string | null
          shares_count?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
        }
        Update: {
          additional_metrics?: Json | null
          analytics_date?: string
          average_time_on_page?: number | null
          bounce_rate?: number | null
          comments_count?: number | null
          created_at?: string | null
          daily_views?: number | null
          id?: string
          post_id?: string | null
          shares_count?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_attachments: {
        Row: {
          attachment_id: string
          attachment_type: string | null
          created_at: string | null
          post_id: string
          sort_order: number | null
        }
        Insert: {
          attachment_id: string
          attachment_type?: string | null
          created_at?: string | null
          post_id: string
          sort_order?: number | null
        }
        Update: {
          attachment_id?: string
          attachment_type?: string | null
          created_at?: string | null
          post_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_attachments_attachment_id_fkey"
            columns: ["attachment_id"]
            isOneToOne: false
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_attachments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_categories: {
        Row: {
          category_id: string
          created_at: string | null
          post_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          post_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          created_at: string | null
          post_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          post_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      post_views: {
        Row: {
          city: string | null
          country: string | null
          id: string
          ip_address: unknown | null
          post_id: string | null
          referrer: string | null
          session_duration: number | null
          tracking_data: Json | null
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          id?: string
          ip_address?: unknown | null
          post_id?: string | null
          referrer?: string | null
          session_duration?: number | null
          tracking_data?: Json | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          id?: string
          ip_address?: unknown | null
          post_id?: string | null
          referrer?: string | null
          session_duration?: number | null
          tracking_data?: Json | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          allow_comments: boolean | null
          author_id: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          seo_data: Json | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          allow_comments?: boolean | null
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          seo_data?: Json | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          allow_comments?: boolean | null
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          seo_data?: Json | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          currency: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price_cents: number
          slug: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price_cents: number
          slug: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price_cents?: number
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          metadata: Json | null
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          metadata?: Json | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          metadata?: Json | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          count: number | null
          created_at: string | null
          endpoint: string
          identifier: string
          max_requests: number | null
          updated_at: string | null
          window_size_ms: number | null
          window_start: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          endpoint: string
          identifier: string
          max_requests?: number | null
          updated_at?: string | null
          window_size_ms?: number | null
          window_start?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          endpoint?: string
          identifier?: string
          max_requests?: number | null
          updated_at?: string | null
          window_size_ms?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      system_health: {
        Row: {
          created_at: string | null
          id: string
          last_check: string | null
          metrics: Json | null
          service_name: string
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_check?: string | null
          metrics?: Json | null
          service_name: string
          status: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_check?: string | null
          metrics?: Json | null
          service_name?: string
          status?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          session_data: Json | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          session_data?: Json | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          session_data?: Json | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_posts: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      cleanup_expired_cache: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_published_posts: {
        Args: { limit_param?: number; offset_param?: number }
        Returns: {
          id: string
          title: string
          slug: string
          excerpt: string
          featured_image_url: string
          published_at: string
          view_count: number
          author_name: string
        }[]
      }
      has_product: {
        Args: { p_slug: string }
        Returns: boolean
      }
      increment_post_views: {
        Args: { post_id_param: string } | { post_slug: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      toggle_post_featured: {
        Args: { post_id: string; user_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const 