import { SignUpForm } from "@/components/sign-up-form";

interface SignUpPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function Page({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const redirectTo = params.next || "/protected/setup-profile";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
