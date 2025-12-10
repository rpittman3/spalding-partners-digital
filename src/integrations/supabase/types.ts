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
      access_requests: {
        Row: {
          access_code: string
          code_expires_at: string
          email: string
          id: string
          last_name: string
          requested_at: string | null
          status: string | null
          used_at: string | null
        }
        Insert: {
          access_code: string
          code_expires_at: string
          email: string
          id?: string
          last_name: string
          requested_at?: string | null
          status?: string | null
          used_at?: string | null
        }
        Update: {
          access_code?: string
          code_expires_at?: string
          email?: string
          id?: string
          last_name?: string
          requested_at?: string | null
          status?: string | null
          used_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs_archive: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          is_built_in: boolean | null
          is_deleted: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_built_in?: boolean | null
          is_deleted?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_built_in?: boolean | null
          is_deleted?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_imports: {
        Row: {
          account_created: boolean | null
          address: string | null
          categories: string | null
          cell_phone: string | null
          company_name: string | null
          email: string
          first_name: string
          id: string
          imported_at: string | null
          last_name: string
          processed_at: string | null
          work_phone: string | null
        }
        Insert: {
          account_created?: boolean | null
          address?: string | null
          categories?: string | null
          cell_phone?: string | null
          company_name?: string | null
          email: string
          first_name: string
          id?: string
          imported_at?: string | null
          last_name: string
          processed_at?: string | null
          work_phone?: string | null
        }
        Update: {
          account_created?: boolean | null
          address?: string | null
          categories?: string | null
          cell_phone?: string | null
          company_name?: string | null
          email?: string
          first_name?: string
          id?: string
          imported_at?: string | null
          last_name?: string
          processed_at?: string | null
          work_phone?: string | null
        }
        Relationships: []
      }
      deadline_categories: {
        Row: {
          category_id: string
          created_at: string | null
          deadline_id: string
          id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          deadline_id: string
          id?: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          deadline_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deadline_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deadline_categories_deadline_id_fkey"
            columns: ["deadline_id"]
            isOneToOne: false
            referencedRelation: "deadlines"
            referencedColumns: ["id"]
          },
        ]
      }
      deadline_views: {
        Row: {
          deadline_id: string
          id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          deadline_id: string
          id?: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          deadline_id?: string
          id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deadline_views_deadline_id_fkey"
            columns: ["deadline_id"]
            isOneToOne: false
            referencedRelation: "deadlines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deadline_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deadlines: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string
          id: string
          reminder_15_days_sent: boolean | null
          reminder_30_days_sent: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date: string
          id?: string
          reminder_15_days_sent?: boolean | null
          reminder_30_days_sent?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string
          id?: string
          reminder_15_days_sent?: boolean | null
          reminder_30_days_sent?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deadlines_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string | null
          expires_at: string | null
          extension_count: number | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_archived: boolean | null
          is_direct_to_client: boolean | null
          is_expired: boolean | null
          is_seen_by_admin: boolean | null
          is_seen_by_client: boolean | null
          notes: string | null
          purge_at: string | null
          updated_at: string | null
          uploaded_at: string | null
          uploaded_by: string
          user_id: string
        }
        Insert: {
          category?: string | null
          expires_at?: string | null
          extension_count?: number | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_archived?: boolean | null
          is_direct_to_client?: boolean | null
          is_expired?: boolean | null
          is_seen_by_admin?: boolean | null
          is_seen_by_client?: boolean | null
          notes?: string | null
          purge_at?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by: string
          user_id: string
        }
        Update: {
          category?: string | null
          expires_at?: string | null
          extension_count?: number | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_archived?: boolean | null
          is_direct_to_client?: boolean | null
          is_expired?: boolean | null
          is_seen_by_admin?: boolean | null
          is_seen_by_client?: boolean | null
          notes?: string | null
          purge_at?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          uploaded_by?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          created_at: string | null
          created_by: string
          display_order: number
          id: string
          is_active: boolean
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          created_by: string
          display_order?: number
          id?: string
          is_active?: boolean
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          created_by?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      meeting_requests: {
        Row: {
          admin_notes: string | null
          alternate_datetime: string | null
          appointment_set: boolean | null
          id: string
          is_archived: boolean | null
          option_1: string
          option_2: string
          option_3: string
          requested_at: string | null
          responded_at: string | null
          responded_by: string | null
          selected_option: number | null
          status: string | null
          subject: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          alternate_datetime?: string | null
          appointment_set?: boolean | null
          id?: string
          is_archived?: boolean | null
          option_1: string
          option_2: string
          option_3: string
          requested_at?: string | null
          responded_at?: string | null
          responded_by?: string | null
          selected_option?: number | null
          status?: string | null
          subject: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          alternate_datetime?: string | null
          appointment_set?: boolean | null
          id?: string
          is_archived?: boolean | null
          option_1?: string
          option_2?: string
          option_3?: string
          requested_at?: string | null
          responded_at?: string | null
          responded_by?: string | null
          selected_option?: number | null
          status?: string | null
          subject?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_requests_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_categories: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          notification_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          notification_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          notification_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_categories_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_status: {
        Row: {
          archived_at: string | null
          id: string
          is_archived: boolean | null
          is_seen: boolean | null
          notification_id: string
          seen_at: string | null
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_seen?: boolean | null
          notification_id: string
          seen_at?: string | null
          user_id: string
        }
        Update: {
          archived_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_seen?: boolean | null
          notification_id?: string
          seen_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_status_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          created_by: string
          id: string
          is_important: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          created_by: string
          id?: string
          is_important?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_important?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          cell_phone: string | null
          city: string | null
          company_name: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean
          is_main_user: boolean | null
          last_name: string
          parent_user_id: string | null
          state: string | null
          updated_at: string | null
          work_phone: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          cell_phone?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id: string
          is_active?: boolean
          is_main_user?: boolean | null
          last_name: string
          parent_user_id?: string | null
          state?: string | null
          updated_at?: string | null
          work_phone?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          cell_phone?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          is_main_user?: boolean | null
          last_name?: string
          parent_user_id?: string | null
          state?: string | null
          updated_at?: string | null
          work_phone?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_parent_user_id_fkey"
            columns: ["parent_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      public_resources: {
        Row: {
          category: Database["public"]["Enums"]["public_resource_category"]
          created_at: string
          created_by: string
          description: string
          display_order: number
          file_name: string | null
          file_path: string | null
          id: string
          is_active: boolean
          resource_type: Database["public"]["Enums"]["public_resource_type"]
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["public_resource_category"]
          created_at?: string
          created_by: string
          description: string
          display_order?: number
          file_name?: string | null
          file_path?: string | null
          id?: string
          is_active?: boolean
          resource_type: Database["public"]["Enums"]["public_resource_type"]
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["public_resource_category"]
          created_at?: string
          created_by?: string
          description?: string
          display_order?: number
          file_name?: string | null
          file_path?: string | null
          id?: string
          is_active?: boolean
          resource_type?: Database["public"]["Enums"]["public_resource_type"]
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          ip_address: string
          request_count: number
          window_start: string
        }
        Insert: {
          created_at?: string
          ip_address: string
          request_count?: number
          window_start?: string
        }
        Update: {
          created_at?: string
          ip_address?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      resource_categories: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          resource_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          resource_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          resource_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_categories_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_views: {
        Row: {
          id: string
          resource_id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          resource_id: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          resource_id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_views_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_important: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_important?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_important?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          email: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          photo_path: string | null
          position: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          photo_path?: string | null
          position: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          photo_path?: string | null
          position?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_categories: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          id: string
          notify_deadlines: boolean | null
          notify_notifications: boolean | null
          notify_resources: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          notify_deadlines?: boolean | null
          notify_notifications?: boolean | null
          notify_resources?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          notify_deadlines?: boolean | null
          notify_notifications?: boolean | null
          notify_resources?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          _ip_address: string
          _max_requests: number
          _window_minutes: number
        }
        Returns: {
          allowed: boolean
          requests_remaining: number
        }[]
      }
      cleanup_rate_limits: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client" | "sub_user"
      public_resource_category: "tax_resources" | "guides_articles"
      public_resource_type: "url" | "pdf"
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
      app_role: ["admin", "client", "sub_user"],
      public_resource_category: ["tax_resources", "guides_articles"],
      public_resource_type: ["url", "pdf"],
    },
  },
} as const
