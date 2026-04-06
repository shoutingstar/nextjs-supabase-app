/**
 * 이벤트 폼 Zod 검증 스키마
 * React Hook Form + zodResolver와 함께 사용
 * Phase 3에서 서버 검증과 통합 예정
 */

import { z } from "zod";

/* ============================================================================
 * 이벤트 생성 스키마
 * ============================================================================ */

/**
 * 이벤트 생성 폼 검증 스키마
 *
 * @field title - 이벤트 제목 (1~100자 필수)
 * @field start_date - 시작 날짜/시간 (datetime-local 입력값, 필수)
 * @field location - 장소 (선택)
 * @field max_participants - 최대 참여 인원 (선택, 양의 정수)
 * @field description - 이벤트 설명 (선택)
 * @field cover_image - 커버 이미지 파일 (선택, SSR 호환을 위해 any)
 */
export const createEventSchema = z.object({
  title: z
    .string()
    .min(1, "이벤트 제목을 입력해 주세요")
    .max(100, "제목은 100자 이하로 입력해 주세요"),

  start_date: z.string().min(1, "날짜와 시간을 선택해 주세요"),

  location: z
    .string()
    .max(200, "장소는 200자 이하로 입력해 주세요")
    .optional()
    .or(z.literal("")),

  // Zod v4 + react-hook-form 호환: z.number().optional()으로 명확한 타입 제공
  // 빈 문자열 처리는 폼 컴포넌트의 onChange에서 담당
  max_participants: z
    .number()
    .int("정수를 입력해 주세요")
    .positive("1명 이상 입력해 주세요")
    .max(10000, "최대 10,000명까지 설정할 수 있습니다")
    .optional(),

  description: z
    .string()
    .max(2000, "설명은 2,000자 이하로 입력해 주세요")
    .optional()
    .or(z.literal("")),

  // 브라우저 File 타입: SSR 환경에서 File이 undefined일 수 있어 z.any() 사용

  cover_image: z.any().optional(),
});

/* ============================================================================
 * 이벤트 수정 스키마
 * ============================================================================ */

/**
 * 이벤트 상태 enum
 * DB check 제약: draft | active | cancelled | completed
 */
export const eventStatusSchema = z.enum([
  "draft",
  "active",
  "cancelled",
  "completed",
]);

/**
 * 이벤트 수정 폼 검증 스키마
 * createEventSchema를 부분 확장하고 status 필드 추가
 */
export const updateEventSchema = createEventSchema.partial().extend({
  status: eventStatusSchema.optional(),
});

/* ============================================================================
 * TypeScript 타입 추론
 * ============================================================================ */

/** 이벤트 생성 폼 데이터 타입 (Zod 스키마에서 추론) */
export type CreateEventFormValues = z.infer<typeof createEventSchema>;

/** 이벤트 수정 폼 데이터 타입 (Zod 스키마에서 추론) */
export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;

/** 이벤트 상태 타입 (Zod enum에서 추론) */
export type EventStatusValue = z.infer<typeof eventStatusSchema>;
