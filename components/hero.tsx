import { Calendar, Link as LinkIcon, Users } from "lucide-react";

import { GoogleOAuthButton } from "./google-oauth-button";

function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Calendar;
}) {
  return (
    <div className="border-primary/15 from-primary/5 via-card to-primary/5 hover:border-primary/40 hover:shadow-primary/10 group flex overflow-hidden rounded-2xl border bg-gradient-to-br shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* 왼쪽 아이콘 */}
      <div className="from-primary/20 via-primary/10 to-primary/5 group-hover:from-primary/30 group-hover:via-primary/20 group-hover:to-primary/10 flex h-28 w-28 flex-shrink-0 items-center justify-center bg-gradient-to-br transition-all duration-300">
        <Icon className="text-primary h-12 w-12 transition-transform duration-300 group-hover:scale-110" />
      </div>

      {/* 오른쪽 텍스트 */}
      <div className="flex-1 p-5">
        <h3 className="text-sm font-semibold leading-tight">{title}</h3>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <div className="flex flex-col gap-6">
      {/* Gather 타이틀 */}
      <div className="space-y-2 text-center">
        <div className="relative inline-block w-full">
          <div className="from-primary via-primary/70 to-primary/40 absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r opacity-20 blur-xl" />
          <h1 className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text py-4 text-5xl font-bold text-transparent sm:text-6xl">
            Gather
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          함께 모이는 가장 간단한 방법
        </p>
      </div>

      {/* 기능 소개 카드 */}
      <div className="space-y-3">
        <FeatureCard
          title="간편한 이벤트 생성"
          description="원클릭으로 이벤트를 생성하고 시작하세요"
          icon={Calendar}
        />
        <FeatureCard
          title="원클릭 초대 시스템"
          description="링크를 공유하는 것만으로 초대 완료"
          icon={LinkIcon}
        />
        <FeatureCard
          title="실시간 참여자 관리"
          description="모든 참여자의 상태를 실시간으로 확인"
          icon={Users}
        />
      </div>

      {/* Google 로그인 CTA */}
      <div className="pt-2">
        <GoogleOAuthButton next="/" label="Google로 시작하기" />
      </div>
    </div>
  );
}
