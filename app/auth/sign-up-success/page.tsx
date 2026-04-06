import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SignUpSuccessPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function Page({ searchParams }: SignUpSuccessPageProps) {
  const params = await searchParams;
  const redirectTo = params.next || "/protected/events";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">회원가입 완료!</CardTitle>
              <CardDescription>이메일 확인해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                회원가입이 완료되었습니다. 이메일을 확인하여 계정을 인증한 후
                로그인하세요.
              </p>

              <div className="space-y-2 pt-2">
                <p className="text-muted-foreground text-xs font-medium">
                  다음 단계:
                </p>
                <ol className="text-muted-foreground space-y-1 text-xs">
                  <li>1. 받은 편지함에서 인증 이메일 확인</li>
                  <li>2. 이메일의 링크 클릭</li>
                  <li>3. 계정이 인증되면 로그인</li>
                </ol>
              </div>

              <Button className="w-full" asChild>
                <Link
                  href={`/auth/login?next=${encodeURIComponent(redirectTo)}`}
                >
                  로그인 페이지로 이동
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
