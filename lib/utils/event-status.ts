/**
 * 이벤트 상태 자동 계산 유틸리티
 * - Server Actions 파일("use server")과 분리하여 일반 함수로 정의
 * - lib/queries/events.ts에서 import하여 사용
 */

import type { EventStatus } from "@/lib/types/event";

/**
 * 이벤트 날짜와 현재 시간을 비교하여 자동 상태를 계산합니다.
 * draft → active → completed 순서로 자동 전환
 * (cancelled는 수동으로만 설정 가능)
 *
 * @param eventDate - 이벤트 날짜 (ISO 8601)
 * @param currentStatus - 현재 상태
 * @returns 계산된 새로운 상태
 */
export function computeEventStatus(
  eventDate: string,
  currentStatus: EventStatus,
): EventStatus {
  // 취소된 이벤트는 자동 변경 없음
  if (currentStatus === "cancelled") return "cancelled";

  const now = new Date();
  const eventDateTime = new Date(eventDate);

  // 이벤트 종료 기준: 이벤트 시작 시간으로부터 3시간 후
  const eventEndTime = new Date(eventDateTime.getTime() + 3 * 60 * 60 * 1000);

  if (now >= eventEndTime) {
    // 이벤트 종료 후 → completed
    return "completed";
  } else if (now >= eventDateTime) {
    // 이벤트 진행 중 → active (draft는 유지)
    return currentStatus === "draft" ? "draft" : "active";
  } else {
    // 이벤트 시작 전 → 현재 상태 유지
    return currentStatus;
  }
}
