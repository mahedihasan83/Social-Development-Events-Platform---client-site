"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { loginSchema, issuesToFieldErrors } from "@/lib/validation";
import { AuthCard, GoogleButton } from "@/components/auth/auth-card";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    // Client-side validation first — invalid credentials never hit the API.
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors = issuesToFieldErrors(parsed.error);
      setErrors(fieldErrors);
      toast.error(Object.values(fieldErrors)[0] ?? "Please check the form.");
      return;
    }

    setSubmitting(true);
    const { error } = await authClient.signIn.email({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message ?? "Invalid email or password.");
      return;
    }

    toast.success("Welcome back! You have logged in successfully. 🎉");
    router.push(redirectTo);
    router.refresh();
  }

  function handleGoogleLogin() {
    setGoogleLoading(true);
    // Full-page redirect into Google's consent screen.
    authClient.signIn.social({
      provider: "google",
      callbackURL: redirectTo,
      fetchOptions: {
        onError: (ctx) => {
          setGoogleLoading(false);
          toast.error(
            ctx.error.message ??
              "Google login is not available right now. Please try email login."
          );
        },
      },
    });
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to create, join and manage community events."
    >
      <GoogleButton label="Continue with Google" loading={googleLoading} onClick={handleGoogleLogin} />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              autoComplete="current-password"
              className="pr-9"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting && <LoaderCircleIcon className="size-4 animate-spin" />}
          {submitting ? "Logging in…" : "Login"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={redirectTo !== "/" ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register"}
          className="font-medium text-primary hover:underline"
        >
          Register
        </Link>
      </p>
    </AuthCard>
  );
}
