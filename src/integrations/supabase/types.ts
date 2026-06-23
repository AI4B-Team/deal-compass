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
      buyer_transactions: {
        Row: {
          acreage: number | null
          address: string
          arv_at_purchase: number | null
          baths: number | null
          beds: number | null
          buyer_id: string
          city: string | null
          confidence: string
          created_at: string
          deal_type: string
          id: string
          last_verified_at: string | null
          lat: number | null
          lng: number | null
          property_type: string | null
          purchase_date: string | null
          purchase_price: number | null
          sold_date: string | null
          sold_price: number | null
          source: string | null
          sqft: number | null
          state: string | null
          updated_at: string
          zip: string | null
        }
        Insert: {
          acreage?: number | null
          address: string
          arv_at_purchase?: number | null
          baths?: number | null
          beds?: number | null
          buyer_id: string
          city?: string | null
          confidence?: string
          created_at?: string
          deal_type: string
          id?: string
          last_verified_at?: string | null
          lat?: number | null
          lng?: number | null
          property_type?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          sold_date?: string | null
          sold_price?: number | null
          source?: string | null
          sqft?: number | null
          state?: string | null
          updated_at?: string
          zip?: string | null
        }
        Update: {
          acreage?: number | null
          address?: string
          arv_at_purchase?: number | null
          baths?: number | null
          beds?: number | null
          buyer_id?: string
          city?: string | null
          confidence?: string
          created_at?: string
          deal_type?: string
          id?: string
          last_verified_at?: string | null
          lat?: number | null
          lng?: number | null
          property_type?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          sold_date?: string | null
          sold_price?: number | null
          source?: string | null
          sqft?: number | null
          state?: string | null
          updated_at?: string
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
        ]
      }
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
          offers_closed_count: number
          offers_made_count: number
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
          offers_closed_count?: number
          offers_made_count?: number
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
          offers_closed_count?: number
          offers_made_count?: number
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
      deal_outreach: {
        Row: {
          body: string | null
          buyer_id: string
          channel: string
          created_at: string
          deal_id: string
          error_message: string | null
          id: string
          match_score: number | null
          recipient: string | null
          status: string
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          buyer_id: string
          channel: string
          created_at?: string
          deal_id: string
          error_message?: string | null
          id?: string
          match_score?: number | null
          recipient?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          buyer_id?: string
          channel?: string
          created_at?: string
          deal_id?: string
          error_message?: string | null
          id?: string
          match_score?: number | null
          recipient?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_outreach_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_outreach_deal_id_fkey"
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
          auto_market_override: boolean | null
          auto_market_status: string
          auto_marketed_at: string | null
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
          auto_market_override?: boolean | null
          auto_market_status?: string
          auto_marketed_at?: string | null
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
          auto_market_override?: boolean | null
          auto_market_status?: string
          auto_marketed_at?: string | null
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
      property_records: {
        Row: {
          acreage: number | null
          address: string
          annual_property_tax: number | null
          apn: string | null
          baths: number | null
          beds: number | null
          county: string | null
          created_at: string
          data_source: string | null
          est_current_value: number | null
          id: string
          interest_rate_est: number | null
          is_absentee_owner: boolean | null
          last_assessment: number | null
          last_assessment_year: number | null
          last_purchase_date: string | null
          last_purchase_price: number | null
          last_synced_at: string | null
          lender_name: string | null
          loan_amount: number | null
          loan_balance_est: number | null
          loan_origination_date: string | null
          monthly_payment_est: number | null
          owner_entity: string | null
          owner_mailing_address: string | null
          sqft: number | null
          updated_at: string
          user_id: string
          year_built: number | null
        }
        Insert: {
          acreage?: number | null
          address: string
          annual_property_tax?: number | null
          apn?: string | null
          baths?: number | null
          beds?: number | null
          county?: string | null
          created_at?: string
          data_source?: string | null
          est_current_value?: number | null
          id?: string
          interest_rate_est?: number | null
          is_absentee_owner?: boolean | null
          last_assessment?: number | null
          last_assessment_year?: number | null
          last_purchase_date?: string | null
          last_purchase_price?: number | null
          last_synced_at?: string | null
          lender_name?: string | null
          loan_amount?: number | null
          loan_balance_est?: number | null
          loan_origination_date?: string | null
          monthly_payment_est?: number | null
          owner_entity?: string | null
          owner_mailing_address?: string | null
          sqft?: number | null
          updated_at?: string
          user_id: string
          year_built?: number | null
        }
        Update: {
          acreage?: number | null
          address?: string
          annual_property_tax?: number | null
          apn?: string | null
          baths?: number | null
          beds?: number | null
          county?: string | null
          created_at?: string
          data_source?: string | null
          est_current_value?: number | null
          id?: string
          interest_rate_est?: number | null
          is_absentee_owner?: boolean | null
          last_assessment?: number | null
          last_assessment_year?: number | null
          last_purchase_date?: string | null
          last_purchase_price?: number | null
          last_synced_at?: string | null
          lender_name?: string | null
          loan_amount?: number | null
          loan_balance_est?: number | null
          loan_origination_date?: string | null
          monthly_payment_est?: number | null
          owner_entity?: string | null
          owner_mailing_address?: string | null
          sqft?: number | null
          updated_at?: string
          user_id?: string
          year_built?: number | null
        }
        Relationships: []
      }
      property_transaction_history: {
        Row: {
          buyer_name: string | null
          created_at: string
          id: string
          price: number | null
          property_record_id: string
          sale_date: string | null
          sale_type: string | null
          seller_name: string | null
        }
        Insert: {
          buyer_name?: string | null
          created_at?: string
          id?: string
          price?: number | null
          property_record_id: string
          sale_date?: string | null
          sale_type?: string | null
          seller_name?: string | null
        }
        Update: {
          buyer_name?: string | null
          created_at?: string
          id?: string
          price?: number | null
          property_record_id?: string
          sale_date?: string | null
          sale_type?: string | null
          seller_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_transaction_history_property_record_id_fkey"
            columns: ["property_record_id"]
            isOneToOne: false
            referencedRelation: "property_records"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          auto_market_channels: string
          auto_market_content_mode: string
          auto_market_email_template: string | null
          auto_market_enabled: boolean
          auto_market_min_score: number
          auto_market_sms_template: string | null
          auto_market_target_mode: string
          auto_market_top_n: number
          auto_market_trigger: string
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
          auto_market_channels?: string
          auto_market_content_mode?: string
          auto_market_email_template?: string | null
          auto_market_enabled?: boolean
          auto_market_min_score?: number
          auto_market_sms_template?: string | null
          auto_market_target_mode?: string
          auto_market_top_n?: number
          auto_market_trigger?: string
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
          auto_market_channels?: string
          auto_market_content_mode?: string
          auto_market_email_template?: string | null
          auto_market_enabled?: boolean
          auto_market_min_score?: number
          auto_market_sms_template?: string | null
          auto_market_target_mode?: string
          auto_market_top_n?: number
          auto_market_trigger?: string
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
      buyer_portfolio_stats: {
        Row: {
          avg_days_between_purchases: number | null
          avg_flip_duration_days: number | null
          avg_purchase_arv_pct: number | null
          avg_purchase_price: number | null
          buyer_id: string | null
          est_portfolio_value: number | null
          flip_count: number | null
          land_count: number | null
          main_property_type: string | null
          rental_count: number | null
          total_count: number | null
          wholetail_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
        ]
      }
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
