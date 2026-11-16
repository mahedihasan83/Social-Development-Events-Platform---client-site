"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { PageLoader } from "@/components/shared/page-loader";

/**
 * Client-side guard for private/protected routes.
 *
 * While the session is resolving we show a loader (never a redirect), so a
 * logged-in user reloading a private route is never bounced to /login.
 */
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
