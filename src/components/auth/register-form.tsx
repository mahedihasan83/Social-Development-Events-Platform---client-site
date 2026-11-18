"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { registerSchema, issuesToFieldErrors } from "@/lib/validation";
import { AuthCard, GoogleButton, googleErrorMessage } from "@/components/auth/auth-card";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", photoUrl: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = issuesToFieldErrors(parsed.error);
      setErrors(fieldErrors);
     
      toast.error(Object.values(fieldErrors)[0] ?? "Please check the form.");
      return;
    }

    setSubmitting(true);
    const { error } = await authClient.signUp.email({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      image: parsed.data.photoUrl,
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message ?? "Registration failed. Please try again.");
      return;
    }

    toast.success("Account created successfully! Welcome to Shohojog. 🎉");
    router.push("/");
    router.refresh();
  }

  function handleGoogleRegister() {
    setGoogleLoading(true);
    authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      fetchOptions: {
        onError: (ctx) => {
          setGoogleLoading(false);
          toast.error(googleErrorMessage(ctx.error));
        },
      },
    });
  }

  return (
    <AuthCard
      title="Create your account"
      description="Join thousands of volunteers making a difference."
    >
      <GoogleButton label="Sign up with Google" loading={googleLoading} onClick={handleGoogleRegister} />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or register with email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your full name"
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="photoUrl">Photo URL</Label>
          <Input
            id="photoUrl"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            autoComplete="url"
            value={form.photoUrl}
            onChange={update("photoUrl")}
            aria-invalid={Boolean(errors.photoUrl)}
          />
          {errors.photoUrl && <p className="text-xs text-destructive">{errors.photoUrl}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 6 chars, 1 uppercase + 1 lowercase"
              autoComplete="new-password"
              className="pr-9"
              value={form.password}
              onChange={update("password")}
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
          {submitting ? "Creating account…" : "Register"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
