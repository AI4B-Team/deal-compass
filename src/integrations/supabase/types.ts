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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      buyers: {
        Row: {
          arv_max: number | null
          arv_min: number | null
          buy_box_notes: string | null
          buyer_tier: string
          company: string | null
          condition_tolerance: string | null
          created_at: string
          deal_types: string[]
          deals_bought_count: number
          email: string | null
          financing_type: string | null
          general_notes: string | null
          id: string
          last_contacted_date: string | null
          last_purchase_date: string | null
          max_concurrent_deals: number | null
          min_baths: number | null
          min_beds: number | null
          min_spread: number | null
          min_sqft: number | null
          name: string
          phone: string | null
          preferred_contact_method: string | null
          price_max: number | null
          price_min: number | null
          proof_of_funds: boolean
          property_types: string[]
          status: string
          target_areas: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          arv_max?: number | null
          arv_min?: number | null
          buy_box_notes?: string | null
          buyer_tier?: string
          company?: string | null
          condition_tolerance?: string | null
          created_at?: string
          deal_types?: string[]
          deals_bought_count?: number
          email?: string | null
          financing_type?: string | null
          general_notes?: string | null
          id?: string
          last_contacted_date?: string | null
          last_purchase_date?: string | null
          max_concurrent_deals?: number | null
          min_baths?: number | null
          min_beds?: number | null
          min_spread?: number | null
          min_sqft?: number | null
          name: string
          phone?: string | null
          preferred_contact_method?: string | null
          price_max?: number | null
          price_min?: number | null
          proof_of_funds?: boolean
          property_types?: string[]
          status?: string
          target_areas?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          arv_max?: number | null
          arv_min?: number | null
          buy_box_notes?: string | null
          buyer_tier?: string
          company?: string | null
          condition_tolerance?: string | null
          created_at?: string
          deal_types?: string[]
          deals_bought_count?: number
          email?: string | null
          financing_type?: string | null
          general_notes?: string | null
          id?: string
          last_contacted_date?: string | null
          last_purchase_date?: string | null
          max_concurrent_deals?: number | null
          min_baths?: number | null
          min_beds?: number | null
          min_spread?: number | null
          min_sqft?: number | null
          name?: string
          phone?: string | null
          preferred_contact_method?: string | null
          price_max?: number | null
          price_min?: number | null
          proof_of_funds?: boolean
          property_types?: string[]
          status?: string
          target_areas?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      deal_matches: {
        Row: {
          buyer_id: string
          contacted_at: string | null
          created_at: string
          deal_id: string
          generated_pitch: string | null
          id: string
          interest_status: string
          is_winner: boolean
          match_reasons: string | null
          match_score: number
          match_tier: string
          notes: string | null
          pitch_subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          buyer_id: string
          contacted_at?: string | null
          created_at?: string
          deal_id: string
          generated_pitch?: string | null
          id?: string
          interest_status?: string
          is_winner?: boolean
          match_reasons?: string | null
          match_score?: number
          match_tier?: string
          notes?: string | null
          pitch_subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          buyer_id?: string
          contacted_at?: string | null
          created_at?: string
          deal_id?: string
          generated_pitch?: string | null
          id?: string
          interest_status?: string
          is_winner?: boolean
          match_reasons?: string | null
          match_score?: number
          match_tier?: string
          notes?: string | null
          pitch_subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_matches_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_matches_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          address: string
          arv: number | null
          asking_price: number | null
          assigned_buyer_id: string | null
          assignment_fee: number | null
          baths: number | null
          beds: number | null
          city: string | null
          closing_deadline: string | null
          condition: string | null
          contract_date: string | null
          contract_price: number | null
          county: string | null
          created_at: string
          deal_notes: string | null
          description: string | null
          estimated_rehab: number | null
          final_assignment_fee: number | null
          id: string
          inspection_deadline: string | null
          intended_use: string | null
          property_type: string | null
          sqft: number | null
          state: string | null
          status: string
          updated_at: string
          user_id: string
          year_built: number | null
          zip: string | null
        }
        Insert: {
          address: string
          arv?: number | null
          asking_price?: number | null
          assigned_buyer_id?: string | null
          assignment_fee?: number | null
          baths?: number | null
          beds?: number | null
          city?: string | null
          closing_deadline?: string | null
          condition?: string | null
          contract_date?: string | null
          contract_price?: number | null
          county?: string | null
          created_at?: string
          deal_notes?: string | null
          description?: string | null
          estimated_rehab?: number | null
          final_assignment_fee?: number | null
          id?: string
          inspection_deadline?: string | null
          intended_use?: string | null
          property_type?: string | null
          sqft?: number | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id: string
          year_built?: number | null
          zip?: string | null
        }
        Update: {
          address?: string
          arv?: number | null
          asking_price?: number | null
          assigned_buyer_id?: string | null
          assignment_fee?: number | null
          baths?: number | null
          beds?: number | null
          city?: string | null
          closing_deadline?: string | null
          condition?: string | null
          contract_date?: string | null
          contract_price?: number | null
          county?: string | null
          created_at?: string
          deal_notes?: string | null
          description?: string | null
          estimated_rehab?: number | null
          final_assignment_fee?: number | null
          id?: string
          inspection_deadline?: string | null
          intended_use?: string | null
          property_type?: string | null
          sqft?: number | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          year_built?: number | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_assigned_buyer_id_fkey"
            columns: ["assigned_buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          brand_name: string | null
          created_at: string
          default_market: string | null
          default_state: string | null
          signature: string | null
          updated_at: string
          user_id: string
          weight_condition: number
          weight_price: number
          weight_size: number
          weight_spread: number
          weight_strategy: number
        }
        Insert: {
          brand_name?: string | null
          created_at?: string
          default_market?: string | null
          default_state?: string | null
          signature?: string | null
          updated_at?: string
          user_id: string
          weight_condition?: number
          weight_price?: number
          weight_size?: number
          weight_spread?: number
          weight_strategy?: number
        }
        Update: {
          brand_name?: string | null
          created_at?: string
          default_market?: string | null
          default_state?: string | null
          signature?: string | null
          updated_at?: string
          user_id?: string
          weight_condition?: number
          weight_price?: number
          weight_size?: number
          weight_spread?: number
          weight_strategy?: number
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
  public: {
    Enums: {},
  },
} as const
