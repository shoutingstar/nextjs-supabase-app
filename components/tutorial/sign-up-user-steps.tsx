import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { TutorialStep } from "./tutorial-step";

export function SignUpUserSteps() {
  return (
    <ol className="flex flex-col gap-6">
      {process.env.VERCEL_ENV === "preview" ||
      process.env.VERCEL_ENV === "production" ? (
        <TutorialStep title="리다이렉트 URL 설정">
          <p>이 앱이 Vercel에 호스팅되어 있습니다.</p>
          <p className="mt-4">
            현재 배포는{" "}
            <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
              &quot;{process.env.VERCEL_ENV}&quot;
            </span>
            이며{" "}
            <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
              https://{process.env.VERCEL_URL}
            </span>
            에 있습니다.
          </p>
          <p className="mt-4">
            <Link
              className="text-primary hover:text-foreground"
              href={
                "https://supabase.com/dashboard/project/_/auth/url-configuration"
              }
            >
              Supabase 프로젝트
            </Link>
            를 업데이트하여 Vercel 배포 URL 기반의 리다이렉트 URL을 추가해야
            합니다.
          </p>
          <ul className="mt-4">
            <li>
              -{" "}
              <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
                http://localhost:3000/**
              </span>
            </li>
            <li>
              -{" "}
              <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
                {`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/**`}
              </span>
            </li>
            <li>
              -{" "}
              <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
                {`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
                  ".vercel.app",
                  "",
                )}-*-[vercel-team-url].vercel.app/**`}
              </span>{" "}
              (Vercel 팀 URL은{" "}
              <Link
                className="text-primary hover:text-foreground"
                href="https://vercel.com/docs/accounts/create-a-team#find-your-team-id"
                target="_blank"
              >
                Vercel 팀 설정
              </Link>
              에서 찾을 수 있습니다)
            </li>
          </ul>
          <Link
            href="https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls"
            target="_blank"
            className="text-primary/50 hover:text-primary mt-4 flex items-center gap-1 text-sm"
          >
            리다이렉트 URL 문서 <ArrowUpRight size={14} />
          </Link>
        </TutorialStep>
      ) : null}
      <TutorialStep title="첫 번째 사용자 가입">
        <p>
          <Link
            href="auth/sign-up"
            className="text-foreground/80 font-bold hover:underline"
          >
            회원가입
          </Link>{" "}
          페이지로 이동하여 첫 번째 사용자를 등록하세요. 지금은 본인만 가입해도
          괜찮습니다. 멋진 서비스는 곧 많은 사용자를 가질 것입니다!
        </p>
      </TutorialStep>
    </ol>
  );
}
