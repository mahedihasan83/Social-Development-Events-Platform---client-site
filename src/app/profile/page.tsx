"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AuthGuard } from "@/components/shared/auth-guard";
import { PageHeading, PageLoader } from "@/components/shared/page-loader";
import { authClient } from "@/lib/auth-client";
import { initials } from "@/lib/format";
import { z } from "zod";
import { issuesToFieldErrors } from "@/lib/validation";
import type { SessionUser } from "@/lib/types";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long."),
  photoUrl: z.url("Photo URL must be a valid URL (https://…).").or(z.literal("")),
});

/**
 * Private page: view and update your profile (name + profile picture).
 * The form is keyed by user id so it re-initializes from the session
 * without syncing state inside an effect.
 */
function ProfileContent() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session?.user) {
    return <PageLoader label="Loading your profile…" />;
  }

  return <ProfileForm key={session.user.id} user={session.user} />;
}

function ProfileForm({ user }: { user: SessionUser }) {
  const [name, setName] = useState(user.name);
  const [photoUrl, setPhotoUrl] = useState(user.image ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const parsed = profileSchema.safeParse({ name, photoUrl });
    if (!parsed.success) {
      const fieldErrors = issuesToFieldErrors(parsed.error);
      setErrors(fieldErrors);
      toast.error(Object.values(fieldErrors)[0] ?? "Please check the form.");
      return;
    }

    setSaving(true);
    const { error } = await authClient.updateUser({
      name: parsed.data.name,
      ...(parsed.data.photoUrl ? { image: parsed.data.photoUrl } : {}),
    });
    setSaving(false);

    if (error) {
      toast.error(error.message ?? "Could not update your profile.");
      return;
    }
    toast.success("Profile updated successfully! ✅");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 md:py-14">
      <PageHeading
        title="My Profile"
        description="View your account details and update your name or profile picture."
      />

      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="size-20">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
              {initials(user.name || user.email)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </CardHeader>

        <CardContent>
          <Separator className="mb-6" />

          <form onSubmit={handleSave} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Display Name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-photo">Profile Picture URL</Label>
              <Input
                id="profile-photo"
                type="url"
                placeholder="https://example.com/me.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                aria-invalid={Boolean(errors.photoUrl)}
              />
              {errors.photoUrl && (
                <p className="text-xs text-destructive">{errors.photoUrl}</p>
              )}
            </div>

            <Button type="submit" disabled={saving}>
              {saving && <LoaderCircleIcon className="size-4 animate-spin" />}
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
