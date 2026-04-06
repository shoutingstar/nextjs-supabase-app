export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  public: {
    Tables: {
      // 공지사항 테이블
      announcements: {
        Row: {
          author_id: string;
          content: string;
          created_at: string;
          event_id: string;
          id: string;
          is_pinned: boolean;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string;
          event_id: string;
          id?: string;
          is_pinned?: boolean;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string;
          event_id?: string;
          id?: string;
          is_pinned?: boolean;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcements_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      // 카풀 요청 테이블
      carpool_requests: {
        Row: {
          created_at: string;
          id: string;
          message: string | null;
          slot_id: string;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          message?: string | null;
          slot_id: string;
          status?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          message?: string | null;
          slot_id?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "carpool_requests_slot_id_fkey";
            columns: ["slot_id"];
            isOneToOne: false;
            referencedRelation: "carpool_slots";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "carpool_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      // 카풀 슬롯 테이블
      carpool_slots: {
        Row: {
          created_at: string;
          departure_location: string;
          departure_time: string;
          driver_id: string;
          event_id: string;
          id: string;
          note: string | null;
          status: string;
          total_seats: number;
        };
        Insert: {
          created_at?: string;
          departure_location: string;
          departure_time: string;
          driver_id: string;
          event_id: string;
          id?: string;
          note?: string | null;
          status?: string;
          total_seats: number;
        };
        Update: {
          created_at?: string;
          departure_location?: string;
          departure_time?: string;
          driver_id?: string;
          event_id?: string;
          id?: string;
          note?: string | null;
          status?: string;
          total_seats?: number;
        };
        Relationships: [
          {
            foreignKeyName: "carpool_slots_driver_id_fkey";
            columns: ["driver_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "carpool_slots_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      // 이벤트 참가자 테이블
      event_participants: {
        Row: {
          event_id: string;
          id: string;
          joined_at: string;
          rsvp: string;
          status: string;
          user_id: string;
        };
        Insert: {
          event_id: string;
          id?: string;
          joined_at?: string;
          rsvp?: string;
          status?: string;
          user_id: string;
        };
        Update: {
          event_id?: string;
          id?: string;
          joined_at?: string;
          rsvp?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      // 이벤트 테이블
      events: {
        Row: {
          cover_image_url: string | null;
          created_at: string;
          description: string | null;
          event_date: string;
          host_id: string;
          id: string;
          invite_code: string;
          location: string | null;
          max_participants: number | null;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          event_date: string;
          host_id: string;
          id?: string;
          invite_code?: string;
          location?: string | null;
          max_participants?: number | null;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          event_date?: string;
          host_id?: string;
          id?: string;
          invite_code?: string;
          location?: string | null;
          max_participants?: number | null;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_host_id_fkey";
            columns: ["host_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      // 지출 분담 테이블
      expense_splits: {
        Row: {
          expense_id: string;
          id: string;
          is_paid: boolean;
          paid_at: string | null;
          share: number;
          user_id: string;
        };
        Insert: {
          expense_id: string;
          id?: string;
          is_paid?: boolean;
          paid_at?: string | null;
          share: number;
          user_id: string;
        };
        Update: {
          expense_id?: string;
          id?: string;
          is_paid?: boolean;
          paid_at?: string | null;
          share?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expense_splits_expense_id_fkey";
            columns: ["expense_id"];
            isOneToOne: false;
            referencedRelation: "expenses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expense_splits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      // 지출 테이블
      expenses: {
        Row: {
          amount: number;
          created_at: string;
          event_id: string;
          id: string;
          payer_id: string;
          split_count: number;
          title: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          event_id: string;
          id?: string;
          payer_id: string;
          split_count: number;
          title: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          event_id?: string;
          id?: string;
          payer_id?: string;
          split_count?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_payer_id_fkey";
            columns: ["payer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      // 사용자 프로필 테이블
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          role: string;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          role?: string;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          role?: string;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      // 카풀 요청 상태: 대기 | 승인 | 거절
      carpool_request_status: "pending" | "approved" | "rejected";
      // 이벤트 상태: 초안 | 활성 | 취소 | 완료
      event_status: "draft" | "active" | "cancelled" | "completed";
      // 참가자 상태: 대기 | 승인 | 거절
      participant_status: "pending" | "approved" | "rejected";
      // RSVP 상태: 참석 | 불참 | 대기
      rsvp_status: "attending" | "not_attending" | "pending";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

// ENUM 상수 배열 - UI 드롭다운 등에 활용 가능
export const Constants = {
  public: {
    Enums: {
      // 카풀 요청 상태 값 배열
      carpool_request_status: ["pending", "approved", "rejected"],
      // 이벤트 상태 값 배열
      event_status: ["draft", "active", "cancelled", "completed"],
      // 참가자 상태 값 배열
      participant_status: ["pending", "approved", "rejected"],
      // RSVP 상태 값 배열
      rsvp_status: ["attending", "not_attending", "pending"],
    },
  },
} as const;
