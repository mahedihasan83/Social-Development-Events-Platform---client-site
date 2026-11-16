"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Light/dark theme provider (class strategy, system default). */
export function ThemeProvider(props: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />;
}
