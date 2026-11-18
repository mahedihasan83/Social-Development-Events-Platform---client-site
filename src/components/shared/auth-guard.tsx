"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { PageLoader } from "@/components/shared/page-loader";


export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      const redirectTo = encodeURIComponent(window.location.pathname);
      router.replace(`/login?redirect=${redirectTo}`);
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
