import { TutorialStep } from "./tutorial-step";

export function ConnectSupabaseSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="Supabase 프로젝트 생성">
        <p>
          <a
            href="https://app.supabase.com/project/_/settings/api"
            target="_blank"
            className="text-foreground/80 font-bold hover:underline"
            rel="noreferrer"
          >
            database.new
          </a>
          에서 새로운 Supabase 프로젝트를 생성하세요.
        </p>
      </TutorialStep>

      <TutorialStep title="환경 변수 설정">
        <p>
          Next.js 앱의{" "}
          <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
            .env.example
          </span>{" "}
          파일을{" "}
          <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
            .env.local
          </span>
          로 변경하고{" "}
          <a
            href="https://app.supabase.com/project/_/settings/api"
            target="_blank"
            className="text-foreground/80 font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase API 설정
          </a>
          에서 값을 복사해 입력하세요.
        </p>
      </TutorialStep>

      <TutorialStep title="개발 서버 재시작">
        <p>
          Next.js 개발 서버를 중지한 후{" "}
          <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
            npm run dev
          </span>
          를 다시 실행하여 새로운 환경 변수를 로드해야 할 수도 있습니다.
        </p>
      </TutorialStep>

      <TutorialStep title="페이지 새로고침">
        <p>
          Next.js가 새로운 환경 변수를 로드하기 위해 페이지를 새로고침해야 할
          수도 있습니다.
        </p>
      </TutorialStep>
    </ol>
  );
}
