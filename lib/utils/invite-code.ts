/**
 * 초대 코드 생성 유틸
 * - 8자리 대문자 영숫자 코드 생성
 * - UUID를 기반으로 안전한 코드 생성
 */

export function generateInviteCode(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}
