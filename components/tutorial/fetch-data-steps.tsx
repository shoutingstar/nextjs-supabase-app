import { CodeBlock } from "./code-block";
import { TutorialStep } from "./tutorial-step";

const create = `create table notes (
  id bigserial primary key,
  title text
);

insert into notes(title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!');
`.trim();

const rls = `alter table notes enable row level security;
create policy "Allow public read access" on notes
for select
using (true);`.trim();

const server = `import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

const client = `'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('notes').select()
      setNotes(data)
    }
    getData()
  }, [])

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

export function FetchDataSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="테이블 생성 및 데이터 삽입">
        <p>
          Supabase 프로젝트의{" "}
          <a
            href="https://supabase.com/dashboard/project/_/editor"
            className="text-foreground/80 font-bold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            테이블 에디터
          </a>
          로 이동하여 테이블을 생성하고 예제 데이터를 삽입하세요. 아이디어가
          없다면 다음 코드를{" "}
          <a
            href="https://supabase.com/dashboard/project/_/sql/new"
            className="text-foreground/80 font-bold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            SQL 에디터
          </a>
          에 복사하여 붙여넣고 RUN을 클릭하세요!
        </p>
        <CodeBlock code={create} />
      </TutorialStep>

      <TutorialStep title="행 수준 보안 (RLS) 활성화">
        <p>
          Supabase는 기본적으로 행 수준 보안(RLS)을 활성화합니다.{" "}
          <code>notes</code> 테이블에서 데이터를 쿼리하려면 정책을 추가해야
          합니다.{" "}
          <a
            href="https://supabase.com/dashboard/project/_/editor"
            className="text-foreground/80 font-bold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            테이블 에디터
          </a>
          또는{" "}
          <a
            href="https://supabase.com/dashboard/project/_/sql/new"
            className="text-foreground/80 font-bold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            SQL 에디터
          </a>
          에서 이를 수행할 수 있습니다.
        </p>
        <p>
          예를 들어, 다음 SQL을 실행하여 공개 읽기 액세스를 허용할 수 있습니다:
        </p>
        <CodeBlock code={rls} />
        <p>
          RLS에 대해 더 알아보려면{" "}
          <a
            href="https://supabase.com/docs/guides/auth/row-level-security"
            className="text-foreground/80 font-bold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Supabase 문서
          </a>
          를 참고하세요.
        </p>
      </TutorialStep>

      <TutorialStep title="Next.js에서 Supabase 데이터 쿼리">
        <p>
          Supabase 클라이언트를 생성하고 비동기 서버 컴포넌트에서 데이터를
          쿼리하려면,{" "}
          <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
            /app/notes/page.tsx
          </span>
          에 새 page.tsx 파일을 생성하고 다음을 추가하세요.
        </p>
        <CodeBlock code={server} />
        <p>또는 클라이언트 컴포넌트를 사용할 수도 있습니다.</p>
        <CodeBlock code={client} />
      </TutorialStep>

      <TutorialStep title="Supabase UI 라이브러리 탐색">
        <p>
          <a
            href="https://supabase.com/ui"
            className="text-foreground/80 font-bold hover:underline"
          >
            Supabase UI 라이브러리
          </a>
          로 이동하여 일부 블록을 설치해보세요. 예를 들어, 다음을 실행하여
          실시간 채팅 블록을 설치할 수 있습니다:
        </p>
        <CodeBlock
          code={
            "npx shadcn@latest add https://supabase.com/ui/r/realtime-chat-nextjs.json"
          }
        />
      </TutorialStep>

      <TutorialStep title="주말에 만들고 수백만 명에게 서비스하세요!">
        <p>이제 세상에 당신의 제품을 런칭할 준비가 되었습니다! 🚀</p>
      </TutorialStep>
    </ol>
  );
}
