"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Theme customization (challenge requirement): toggles light ⇄ dark.
 * Icons switch via CSS so there is no mounted-state effect and no
 * hydration mismatch.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="size-4 dark:hidden dark:text-current" />
      <MoonIcon className="hidden size-4 dark:block" />
    </Button>
  );
}
