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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blocked_dates: {
        Row: {
          created_at: string
          date: string
          id: string
          reason: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          reason?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      booking_requests: {
        Row: {
          add_ons: Json | null
          admin_notes: string | null
          created_at: string
          creative_types: Json | null
          custom_session_text: string | null
          customer_id: string | null
          deadline: string | null
          deposit_amount: number
          description: string | null
          id: string
          mastering_tracks: number | null
          mastering_type: string | null
          mixing_scope: string | null
          payment_choice: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          reference_url: string | null
          requested_date: string | null
          result_package: string | null
          result_package_price: number
          session_price: number
          session_type: string | null
          song_count: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          track_count: string | null
          updated_at: string
        }
        Insert: {
          add_ons?: Json | null
          admin_notes?: string | null
          created_at?: string
          creative_types?: Json | null
          custom_session_text?: string | null
          customer_id?: string | null
          deadline?: string | null
          deposit_amount?: number
          description?: string | null
          id?: string
          mastering_tracks?: number | null
          mastering_type?: string | null
          mixing_scope?: string | null
          payment_choice?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference_url?: string | null
          requested_date?: string | null
          result_package?: string | null
          result_package_price?: number
          session_price?: number
          session_type?: string | null
          song_count?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          track_count?: string | null
          updated_at?: string
        }
        Update: {
          add_ons?: Json | null
          admin_notes?: string | null
          created_at?: string
          creative_types?: Json | null
          custom_session_text?: string | null
          customer_id?: string | null
          deadline?: string | null
          deposit_amount?: number
          description?: string | null
          id?: string
          mastering_tracks?: number | null
          mastering_type?: string | null
          mixing_scope?: string | null
          payment_choice?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference_url?: string | null
          requested_date?: string | null
          result_package?: string | null
          result_package_price?: number
          session_price?: number
          session_type?: string | null
          song_count?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          track_count?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["customer_status"]
          total_spent: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["customer_status"]
          total_spent?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["customer_status"]
          total_spent?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_status: {
        Row: {
          booking_request_id: string
          file_link: string | null
          file_method: string | null
          file_notes: string | null
          file_received_at: string | null
          file_status: Database["public"]["Enums"]["file_status"]
          id: string
          status: Database["public"]["Enums"]["project_workflow_status"]
          updated_at: string
        }
        Insert: {
          booking_request_id: string
          file_link?: string | null
          file_method?: string | null
          file_notes?: string | null
          file_received_at?: string | null
          file_status?: Database["public"]["Enums"]["file_status"]
          id?: string
          status?: Database["public"]["Enums"]["project_workflow_status"]
          updated_at?: string
        }
        Update: {
          booking_request_id?: string
          file_link?: string | null
          file_method?: string | null
          file_notes?: string | null
          file_received_at?: string | null
          file_status?: Database["public"]["Enums"]["file_status"]
          id?: string
          status?: Database["public"]["Enums"]["project_workflow_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_status_booking_request_id_fkey"
            columns: ["booking_request_id"]
            isOneToOne: false
            referencedRelation: "booking_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      site_media: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          embed_url: string
          id: string
          is_visible: boolean
          media_type: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          embed_url: string
          id?: string
          is_visible?: boolean
          media_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          embed_url?: string
          id?: string
          is_visible?: boolean
          media_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      studio_settings: {
        Row: {
          id: number
          monthly_slot_cap: number
          updated_at: string
        }
        Insert: {
          id?: number
          monthly_slot_cap?: number
          updated_at?: string
        }
        Update: {
          id?: number
          monthly_slot_cap?: number
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          customer_name: string
          customer_role: string | null
          display_order: number
          id: string
          is_approved: boolean
          quote: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          customer_role?: string | null
          display_order?: number
          id?: string
          is_approved?: boolean
          quote: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          customer_role?: string | null
          display_order?: number
          id?: string
          is_approved?: boolean
          quote?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      booking_status:
        | "new"
        | "under_review"
        | "approved"
        | "counter_offer"
        | "declined"
        | "awaiting_payment"
        | "paid"
        | "confirmed"
      customer_status: "new" | "returning" | "high_value"
      file_status:
        | "not_requested"
        | "awaiting"
        | "received"
        | "reviewed"
        | "ready"
      payment_status: "unpaid" | "deposit_paid" | "fully_paid"
      project_workflow_status:
        | "awaiting_files"
        | "files_received"
        | "prep"
        | "mixing"
        | "mastering"
        | "ready_for_delivery"
        | "delivered"
        | "completed"
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
    Enums: {
      booking_status: [
        "new",
        "under_review",
        "approved",
        "counter_offer",
        "declined",
        "awaiting_payment",
        "paid",
        "confirmed",
      ],
      customer_status: ["new", "returning", "high_value"],
      file_status: [
        "not_requested",
        "awaiting",
        "received",
        "reviewed",
        "ready",
      ],
      payment_status: ["unpaid", "deposit_paid", "fully_paid"],
      project_workflow_status: [
        "awaiting_files",
        "files_received",
        "prep",
        "mixing",
        "mastering",
        "ready_for_delivery",
        "delivered",
        "completed",
      ],
    },
  },
} as const
