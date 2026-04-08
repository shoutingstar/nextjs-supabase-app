/**
 * Supabase 인증 에러 메시지를 한국어로 변환합니다.
 * 보안상 이메일 열거 공격 방지를 위해 Supabase는 모든 에러를 일반적인 메시지로 반환합니다.
 */
export function translateAuthError(message: string): string {
  const errorMap: [string, string][] = [
    ["Invalid login credentials", "이메일 또는 비밀번호가 올바르지 않습니다"],
    ["User already registered", "이미 가입된 이메일 주소입니다"],
    ["Email already registered", "이미 가입된 이메일 주소입니다"],
    [
      "Password should be at least 6 characters",
      "비밀번호는 최소 6자 이상이어야 합니다",
    ],
    [
      "Email not confirmed",
      "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요",
    ],
    ["Too many requests", "요청이 너무 많습니다. 잠시 후 다시 시도해주세요"],
    [
      "email rate limit exceeded",
      "회원가입 요청이 너무 많습니다. 잠시 후 다시 시도해주세요",
    ],
    [
      "over_email_send_rate_limit",
      "이메일 발송 한도를 초과했습니다. 잠시 후 다시 시도해주세요",
    ],
    ["signup is disabled", "현재 회원가입이 비활성화되어 있습니다"],
    [
      "관리자 계정이 아닙니다",
      "관리자 권한이 필요합니다. 관리자 계정으로 다시 로그인해주세요",
    ],
    [
      "프로필 정보를 찾을 수 없습니다",
      "사용자 정보 조회에 실패했습니다. 관리자에게 문의해주세요",
    ],
  ];

  for (const [key, value] of errorMap) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return "오류가 발생했습니다. 잠시 후 다시 시도해주세요";
}
