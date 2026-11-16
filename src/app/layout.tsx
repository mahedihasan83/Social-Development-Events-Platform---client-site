import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shohojog — Social Development Events Platform",
    template: "%s | Shohojog",
  },
  description:
    "Shohojog is a community-driven platform to create, join and track social service events — cleanups, plantations, donations and more — in your local area.",
  keywords: [
    "social development",
    "community service",
    "volunteer",
    "events",
    "Bangladesh",
  ],
};

/** Static placeholder rendered while the interactive navbar streams in. */
function NavbarFallback() {
  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="flex items-center gap-2">
          <div className="size-8 animate-pulse rounded-full bg-muted" />
          <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delay={200}>
            {/* Navbar uses runtime hooks (pathname/session) — stream it in
                behind a static shell so every route can prerender. */}
            <Suspense fallback={<NavbarFallback />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster richColors closeButton position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
