export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
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
  public: {
    Tables: {
      "account roles": {
        Row: {
          id: string
          role: string | null
        }
        Insert: {
          id?: string
          role?: string | null
        }
        Update: {
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      application: {
        Row: {
          app_id: string
          approved: boolean | null
          date: string | null
          listing_id: string | null
          user_id: string
        }
        Insert: {
          app_id?: string
          approved?: boolean | null
          date?: string | null
          listing_id?: string | null
          user_id?: string
        }
        Update: {
          app_id?: string
          approved?: boolean | null
          date?: string | null
          listing_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listing"
            referencedColumns: ["listing_id"]
          },
          {
            foreignKeyName: "application_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      listing: {
        Row: {
          capacity: number | null
          categories: string | null
          description: string | null
          distance: number | null
          duration: string | null
          listing_date: string | null
          listing_id: string
          listing_name: string | null
          needed_skill: string | null
          org_id: string
          transport: string | null
          volunteer_time: string | null
        }
        Insert: {
          capacity?: number | null
          categories?: string | null
          description?: string | null
          distance?: number | null
          duration?: string | null
          listing_date?: string | null
          listing_id?: string
          listing_name?: string | null
          needed_skill?: string | null
          org_id: string
          transport?: string | null
          volunteer_time?: string | null
        }
        Update: {
          capacity?: number | null
          categories?: string | null
          description?: string | null
          distance?: number | null
          duration?: string | null
          listing_date?: string | null
          listing_id?: string
          listing_name?: string | null
          needed_skill?: string | null
          org_id?: string
          transport?: string | null
          volunteer_time?: string | null
        }
        Relationships: []
      }
      organization: {
        Row: {
          all_listings: string | null
          bio: string | null
          email: string
          org_id: string
          org_name: string | null
          password_hash: string | null
          website: string | null
        }
        Insert: {
          all_listings?: string | null
          bio?: string | null
          email: string
          org_id: string
          org_name?: string | null
          password_hash?: string | null
          website?: string | null
        }
        Update: {
          all_listings?: string | null
          bio?: string | null
          email?: string
          org_id?: string
          org_name?: string | null
          password_hash?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          email: string | null
          first_name: string | null
          graduation_year: number | null
          last_name: string
          location: string | null
          major: string | null
          phone: number | null
          school: string | null
          skill: string | null
          total_hours_completed: number | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          email?: string | null
          first_name?: string | null
          graduation_year?: number | null
          last_name: string
          location?: string | null
          major?: string | null
          phone?: number | null
          school?: string | null
          skill?: string | null
          total_hours_completed?: number | null
          user_id?: string
        }
        Update: {
          bio?: string | null
          email?: string | null
          first_name?: string | null
          graduation_year?: number | null
          last_name?: string
          location?: string | null
          major?: string | null
          phone?: number | null
          school?: string | null
          skill?: string | null
          total_hours_completed?: number | null
          user_id?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
