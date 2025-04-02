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
      cofounder_profiles: {
        Row: {
          ai_tools: string[] | null
          availability: string
          date_created: string | null
          has_ai_badge: boolean | null
          id: string
          linkedin_url: string | null
          matches: string[] | null
          name: string
          objective: string
          photo_url: string | null
          pitch: string
          portfolio_url: string | null
          profile_type: string
          project_name: string | null
          project_stage: string | null
          region: string
          role: string
          sector: string
          seeking_roles: string[] | null
          user_id: string
          vision: string
          website_url: string | null
        }
        Insert: {
          ai_tools?: string[] | null
          availability: string
          date_created?: string | null
          has_ai_badge?: boolean | null
          id?: string
          linkedin_url?: string | null
          matches?: string[] | null
          name: string
          objective: string
          photo_url?: string | null
          pitch: string
          portfolio_url?: string | null
          profile_type: string
          project_name?: string | null
          project_stage?: string | null
          region: string
          role: string
          sector: string
          seeking_roles?: string[] | null
          user_id: string
          vision: string
          website_url?: string | null
        }
        Update: {
          ai_tools?: string[] | null
          availability?: string
          date_created?: string | null
          has_ai_badge?: boolean | null
          id?: string
          linkedin_url?: string | null
          matches?: string[] | null
          name?: string
          objective?: string
          photo_url?: string | null
          pitch?: string
          portfolio_url?: string | null
          profile_type?: string
          project_name?: string | null
          project_stage?: string | null
          region?: string
          role?: string
          sector?: string
          seeking_roles?: string[] | null
          user_id?: string
          vision?: string
          website_url?: string | null
        }
        Relationships: []
      }
      collaborative_projects: {
        Row: {
          applications: number | null
          category: string
          created_at: string | null
          description: string
          id: string
          initiator_avatar: string | null
          initiator_id: string | null
          initiator_name: string
          likes: number | null
          skills: string[] | null
          status: string
          title: string
        }
        Insert: {
          applications?: number | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          initiator_avatar?: string | null
          initiator_id?: string | null
          initiator_name: string
          likes?: number | null
          skills?: string[] | null
          status: string
          title: string
        }
        Update: {
          applications?: number | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          initiator_avatar?: string | null
          initiator_id?: string | null
          initiator_name?: string
          likes?: number | null
          skills?: string[] | null
          status?: string
          title?: string
        }
        Relationships: []
      }
      community_activities: {
        Row: {
          created_at: string | null
          id: string
          summary: string
          target_id: string
          target_type: string
          title: string
          type: string
          user_avatar: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          summary: string
          target_id: string
          target_type: string
          title: string
          type: string
          user_avatar?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          summary?: string
          target_id?: string
          target_type?: string
          title?: string
          type?: string
          user_avatar?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_name: string
          category: string
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          likes: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_avatar?: string | null
          author_id?: string | null
          author_name: string
          category: string
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          likes?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          likes?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      forum_replies: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_name: string
          content: string
          created_at: string | null
          id: string
          likes: number | null
          parent_id: string | null
          reply_parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_avatar?: string | null
          author_id?: string | null
          author_name: string
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          parent_id?: string | null
          reply_parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          parent_id?: string | null
          reply_parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_reply_parent_id_fkey"
            columns: ["reply_parent_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_rounds: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          id: string
          main_investor: string | null
          round: string
          source_url: string | null
          startup_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          id?: string
          main_investor?: string | null
          round: string
          source_url?: string | null
          startup_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          id?: string
          main_investor?: string | null
          round?: string
          source_url?: string | null
          startup_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_rounds_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      match_notifications: {
        Row: {
          date_created: string | null
          id: string
          message: string | null
          recipient_id: string
          sender_id: string
          sender_name: string
          status: string
        }
        Insert: {
          date_created?: string | null
          id?: string
          message?: string | null
          recipient_id: string
          sender_id: string
          sender_name: string
          status?: string
        }
        Update: {
          date_created?: string | null
          id?: string
          message?: string | null
          recipient_id?: string
          sender_id?: string
          sender_name?: string
          status?: string
        }
        Relationships: []
      }
      product_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes: number | null
          parent_id: string | null
          product_id: string | null
          user_avatar: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          parent_id?: string | null
          product_id?: string | null
          user_avatar?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          parent_id?: string | null
          product_id?: string | null
          user_avatar?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_comments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_launches"
            referencedColumns: ["id"]
          },
        ]
      }
      product_launches: {
        Row: {
          badge_code: string | null
          beta_signup_url: string | null
          category: string[]
          created_at: string | null
          created_by: string
          creator_avatar_url: string | null
          demo_url: string | null
          description: string
          featured_order: number | null
          id: string
          launch_date: string
          logo_url: string | null
          media_urls: string[] | null
          name: string
          startup_id: string | null
          status: string
          tagline: string
          updated_at: string | null
          upvotes: number | null
          website_url: string
        }
        Insert: {
          badge_code?: string | null
          beta_signup_url?: string | null
          category: string[]
          created_at?: string | null
          created_by: string
          creator_avatar_url?: string | null
          demo_url?: string | null
          description: string
          featured_order?: number | null
          id?: string
          launch_date: string
          logo_url?: string | null
          media_urls?: string[] | null
          name: string
          startup_id?: string | null
          status: string
          tagline: string
          updated_at?: string | null
          upvotes?: number | null
          website_url: string
        }
        Update: {
          badge_code?: string | null
          beta_signup_url?: string | null
          category?: string[]
          created_at?: string | null
          created_by?: string
          creator_avatar_url?: string | null
          demo_url?: string | null
          description?: string
          featured_order?: number | null
          id?: string
          launch_date?: string
          logo_url?: string | null
          media_urls?: string[] | null
          name?: string
          startup_id?: string | null
          status?: string
          tagline?: string
          updated_at?: string | null
          upvotes?: number | null
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_launches_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email_notifications: boolean | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email_notifications?: boolean | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email_notifications?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resource_listings: {
        Row: {
          access_link: string
          author_avatar: string | null
          author_id: string | null
          author_name: string
          community_validated: boolean | null
          created_at: string | null
          description: string
          format: string
          id: string
          is_paid: boolean | null
          price: string | null
          target_audience: string
          title: string
          votes: number | null
        }
        Insert: {
          access_link: string
          author_avatar?: string | null
          author_id?: string | null
          author_name: string
          community_validated?: boolean | null
          created_at?: string | null
          description: string
          format: string
          id?: string
          is_paid?: boolean | null
          price?: string | null
          target_audience: string
          title: string
          votes?: number | null
        }
        Update: {
          access_link?: string
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string
          community_validated?: boolean | null
          created_at?: string | null
          description?: string
          format?: string
          id?: string
          is_paid?: boolean | null
          price?: string | null
          target_audience?: string
          title?: string
          votes?: number | null
        }
        Relationships: []
      }
      service_listings: {
        Row: {
          category: string
          contact_link: string | null
          created_at: string | null
          description: string
          expertise: string[] | null
          id: string
          linkedin_url: string | null
          price: string | null
          provider_avatar: string | null
          provider_id: string | null
          provider_name: string
          title: string
        }
        Insert: {
          category: string
          contact_link?: string | null
          created_at?: string | null
          description: string
          expertise?: string[] | null
          id?: string
          linkedin_url?: string | null
          price?: string | null
          provider_avatar?: string | null
          provider_id?: string | null
          provider_name: string
          title: string
        }
        Update: {
          category?: string
          contact_link?: string | null
          created_at?: string | null
          description?: string
          expertise?: string[] | null
          id?: string
          linkedin_url?: string | null
          price?: string | null
          provider_avatar?: string | null
          provider_id?: string | null
          provider_name?: string
          title?: string
        }
        Relationships: []
      }
      startups: {
        Row: {
          ai_impact_score: number
          ai_tools: string[] | null
          ai_use_cases: string | null
          business_model: string
          created_at: string | null
          crunchbase_url: string | null
          date_added: string | null
          founders: Json | null
          id: string
          is_featured: boolean | null
          logo_url: string | null
          long_term_vision: string | null
          maturity_level: string
          name: string
          notion_url: string | null
          pitch_deck_url: string | null
          sector: string
          short_description: string
          tags: string[] | null
          updated_at: string | null
          view_count: number | null
          website_url: string | null
        }
        Insert: {
          ai_impact_score: number
          ai_tools?: string[] | null
          ai_use_cases?: string | null
          business_model: string
          created_at?: string | null
          crunchbase_url?: string | null
          date_added?: string | null
          founders?: Json | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          long_term_vision?: string | null
          maturity_level: string
          name: string
          notion_url?: string | null
          pitch_deck_url?: string | null
          sector: string
          short_description: string
          tags?: string[] | null
          updated_at?: string | null
          view_count?: number | null
          website_url?: string | null
        }
        Update: {
          ai_impact_score?: number
          ai_tools?: string[] | null
          ai_use_cases?: string | null
          business_model?: string
          created_at?: string | null
          crunchbase_url?: string | null
          date_added?: string | null
          founders?: Json | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          long_term_vision?: string | null
          maturity_level?: string
          name?: string
          notion_url?: string | null
          pitch_deck_url?: string | null
          sector?: string
          short_description?: string
          tags?: string[] | null
          updated_at?: string | null
          view_count?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
