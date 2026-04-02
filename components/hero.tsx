import { GoogleOAuthButton } from "./google-oauth-button";

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-primary text-primary-foreground flex flex-col items-center justify-center rounded-xl p-6 text-center">
      <p className="text-sm font-semibold leading-relaxed">{title}</p>
      <p className="mt-2 text-xs opacity-90">{description}</p>
    </div>
  );
}

export function Hero() {
  return (
    <div className="flex flex-col gap-6">
      {/* Gather 타이틀 */}
      <div className="bg-primary text-primary-foreground rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold">Gather</h1>
      </div>

      {/* 기능 소개 카드 */}
      <div className="grid grid-cols-3 gap-3">
        <FeatureCard
          title="간편한
이벤트
생성"
          description="원클릭으로 이벤트 생성"
        />
        <FeatureCard
          title="원클릭
초대
시스템"
          description="쉬운 초대 링크 공유"
        />
        <FeatureCard
          title="실시간
참여자
관리"
          description="실시간 상태 확인"
        />
      </div>

      {/* Google 로그인 CTA */}
      <GoogleOAuthButton next="/" label="Google로 시작하기" />
    </div>
  );
}
