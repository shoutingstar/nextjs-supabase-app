/**
 * useRealtimeSubscription 훅
 * Supabase Realtime을 활용하여 데이터베이스 변경을 실시간으로 구독합니다.
 */

import { useCallback, useEffect, useRef } from "react";

import { createClient } from "@/lib/supabase/client";

/* ============================================================================
 * 타입 정의
 * ============================================================================ */

/**
 * Realtime 변경 이벤트 타입
 */
export type RealtimeEvent<T> = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: T | null;
  old_record: T | null;
  created_at: string;
};

/**
 * Realtime 구독 옵션
 */
export interface RealtimeSubscriptionOptions<T> {
  /** 변경 이벤트 발생 시 호출되는 콜백 함수 */
  onUpdate?: (event: RealtimeEvent<T>) => void;

  /** INSERT 이벤트 발생 시 호출되는 콜백 함수 */
  onInsert?: (data: T) => void;

  /** UPDATE 이벤트 발생 시 호출되는 콜백 함수 */
  onUpdate_?: (newData: T, oldData: T | null) => void;

  /** DELETE 이벤트 발생 시 호출되는 콜백 함수 */
  onDelete?: (data: T) => void;

  /** 에러 발생 시 호출되는 콜백 함수 */
  onError?: (error: Error) => void;
}

/* ============================================================================
 * useRealtimeSubscription 훅
 * ============================================================================ */

/**
 * Supabase Realtime을 활용하여 테이블의 변경을 구독합니다.
 *
 * 사용 예:
 * ```tsx
 * useRealtimeSubscription<ParticipantType>(
 *   'event_participants',
 *   `event_id=eq.${eventId}`,
 *   {
 *     onInsert: (data) => {
 *       console.log('새 참여자:', data);
 *       setParticipants(prev => [...prev, data]);
 *     },
 *     onDelete: (data) => {
 *       setParticipants(prev => prev.filter(p => p.id !== data.id));
 *     },
 *   }
 * );
 * ```
 *
 * @param tableName - 구독할 테이블명
 * @param filter - PostgreSQL 필터 문자열 (예: "event_id=eq.123")
 * @param options - 구독 옵션 (콜백 함수들)
 */
export function useRealtimeSubscription<T extends Record<string, unknown>>(
  tableName: string,
  filter: string,
  options: RealtimeSubscriptionOptions<T> = {},
): void {
  const { onUpdate, onInsert, onUpdate_, onDelete, onError } = options;

  // 구독 ID 참조 (cleanup에서 사용)
  const subscriptionRef = useRef<ReturnType<
    ReturnType<typeof createClient>["channel"]
  > | null>(null);

  // 이벤트 핸들러를 useCallback으로 메모이제이션
  // (의존성 배열에서 제외하고 클로저로 최신 값 접근)
  const handleRealtimeEvent = useCallback(
    (payload: {
      eventType: string;
      new: T | null;
      old: T | null;
      schema: string;
      table: string;
    }) => {
      try {
        const event: RealtimeEvent<T> = {
          type:
            (payload.eventType as "INSERT" | "UPDATE" | "DELETE") || "UPDATE",
          table: payload.table,
          schema: payload.schema,
          record: payload.new,
          old_record: payload.old,
          created_at: new Date().toISOString(),
        };

        // 전체 이벤트 핸들러 호출
        if (onUpdate) {
          onUpdate(event);
        }

        // 타입별 핸들러 호출
        switch (event.type) {
          case "INSERT":
            if (onInsert && payload.new) {
              onInsert(payload.new);
            }
            break;

          case "UPDATE":
            if (onUpdate_ && payload.new && payload.old) {
              onUpdate_(payload.new, payload.old);
            }
            break;

          case "DELETE":
            if (onDelete && payload.old) {
              onDelete(payload.old);
            }
            break;
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error(`[Realtime Error - ${tableName}]`, err);
        if (onError) {
          onError(err);
        }
      }
    },
    [tableName, onUpdate, onInsert, onUpdate_, onDelete, onError],
  );

  useEffect(() => {
    const supabase = createClient();

    // 채널 ID 생성 (테이블명 + 필터로 고유성 확보)
    const channelId = `${tableName}:${filter}`;

    try {
      // Realtime 채널 생성 및 구독
      const channel = supabase
        .channel(channelId, {
          config: {
            broadcast: { self: false }, // 자신의 변경사항 제외
          },
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on<any>(
          "postgres_changes",
          {
            event: "*", // 모든 이벤트 (INSERT, UPDATE, DELETE)
            schema: "public",
            table: tableName,
            filter, // PostgreSQL 필터 적용
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (payload: any) => {
            handleRealtimeEvent(payload);
          },
        )
        .subscribe((status) => {
          if (status === "CHANNEL_ERROR") {
            console.error(`[Realtime Channel Error] ${channelId}`);
          } else if (status === "TIMED_OUT") {
            console.warn(`[Realtime Timeout] ${channelId}`);
          }
        });

      subscriptionRef.current = channel;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error(`[Realtime Subscription Error] ${channelId}`, err);
      if (onError) {
        onError(err);
      }
    }

    // cleanup: 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (subscriptionRef.current) {
        try {
          supabase.removeChannel(subscriptionRef.current);
          subscriptionRef.current = null;
        } catch (error) {
          console.error(`[Realtime Unsubscribe Error]`, error);
        }
      }
    };
  }, [tableName, filter, handleRealtimeEvent, onError]);
}
